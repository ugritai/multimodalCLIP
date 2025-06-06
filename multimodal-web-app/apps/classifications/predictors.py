from transformers import AutoProcessor, AutoModelForZeroShotImageClassification, AutoModel
from apps.classifications.models import ClassificationProcess
from sklearn.metrics import classification_report
from abc import ABC, abstractmethod
from io import BytesIO
from typing import List
from PIL import Image
import requests
import torch

SAMPLE_SIZE=10
REFERENCE_SAMPLE_SIZE=6

device = "cuda" if torch.cuda.is_available() else "cpu"

class ImageClassification:
    url : str
    description : str
    label : int
    def __init__(self, url, label, description):
        self.url = url
        self.label = label
        self.description = description

class Predictor(ABC):
    def __init__(self, processor, model, classification_process : ClassificationProcess):
        self._processor = processor
        self._model = model
        self._classification_process = classification_process

    @abstractmethod
    def predict():
        pass

    def _get_combined_embeddings(self, dataset : List[ImageClassification], interpolation : str):
        texts = []
        images = []
        for row in dataset:
            req_content = requests.get(row.url).content
            images.append(Image.open(BytesIO(req_content)))
            texts.append(row.description)
        reference_inputs = self._processor(text=texts, images=images, return_tensors="pt", padding=True).to(device)
        with torch.no_grad():
            reference_ouputs = self._model(**reference_inputs)

        reference_image_embeddings = reference_ouputs.image_embeds
        reference_text_embeddings = reference_ouputs.text_embeds

        return self._combine_embeddings(reference_image_embeddings, reference_text_embeddings, interpolation)

    def _combine_embeddings(self, image_embeddings, text_embeddings, inteporlation : str):
        interpolation = inteporlation.lower()
        if inteporlation == "sum":
            return image_embeddings + text_embeddings
        elif inteporlation == "average":
            return (image_embeddings + text_embeddings)/2
        elif inteporlation == "multiplicative":
            return (image_embeddings * text_embeddings)
        else:
            raise Exception(f"Combine method {interpolation} not allowed")
        
        
class FewShotPredictor(Predictor):
    def __init__(self, classification_process : ClassificationProcess):
        zeroshot_model = AutoModel.from_pretrained(classification_process.model_name)
        zeroshot_processor = AutoProcessor.from_pretrained(classification_process.model_name)
        super().__init__(zeroshot_processor, zeroshot_model, classification_process)

    def predict(self):
        res = dict()
        predictions = []

        class_column = self._classification_process.parameters['class_column']
        text_column = self._classification_process.parameters['text_column']
        image_column = self._classification_process.parameters['image_column']
        fusion_method = self._classification_process.parameters['fusion_method']
        class_descriptions = self._classification_process.parameters['descriptions']
        
        df = self._classification_process.dataset.load_dataset_as_pandas()
        dfg = df.groupby(class_column)
        df_reference = dfg.sample(int(REFERENCE_SAMPLE_SIZE/dfg.ngroups))
        reference_images = df_reference.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
        reference_embeddings = self._get_combined_embeddings(reference_images, fusion_method)

        df_prediction = dfg.sample(int(SAMPLE_SIZE/dfg.ngroups))
        prediction_images = df_prediction.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
        prediction_embeddings = self._get_combined_embeddings(prediction_images, fusion_method)

        for embedding in prediction_embeddings:
            similarities = torch.nn.functional.cosine_similarity(embedding, reference_embeddings)
            most_similart_idx = similarities.argmax().item()
            predicted_label = reference_images[most_similart_idx].label
            predictions.append(predicted_label)

        true_labels = [x for x in df_prediction[class_column]]
        res["predictions"]=predictions
        res["true_labels"]=true_labels
        res["report"]=classification_report(true_labels, predictions, target_names=class_descriptions, output_dict=True)
        return res

class ZeroShotPredictor(Predictor):
    def __init__(self, classification_process : ClassificationProcess):
        zeroshot_model = AutoModelForZeroShotImageClassification.from_pretrained(classification_process.model_name)
        zeroshot_processor = AutoProcessor.from_pretrained(classification_process.model_name)
        super().__init__(zeroshot_processor, zeroshot_model, classification_process)

    def predict(self):
        res = dict()
        class_column = self._classification_process.parameters['class_column']
        text_column = self._classification_process.parameters['text_column']
        image_column = self._classification_process.parameters['image_column']
        fusion_method = self._classification_process.parameters['fusion_method']
        class_descriptions = self._classification_process.parameters['descriptions']

        df = self._classification_process.dataset.load_dataset_as_pandas()
        dfg = df.groupby(class_column)
        df_sample = dfg.sample(int(SAMPLE_SIZE/dfg.ngroups))
        images = df_sample.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
        predictions = self._compute_accuracy(images, class_descriptions)
        true_labels = [x for x in df_sample[class_column]]
        res["predictions"]=predictions
        res["true_labels"]=true_labels
        res["report"]=classification_report(true_labels, predictions, target_names=class_descriptions, output_dict=True)
        return res
    
    def _compute_accuracy(self, images, labels):
        predictions = list()
        for i in range(len(images)):
            req_content = requests.get(images[i].url).content
            prediction = self._predict_image(Image.open(BytesIO(req_content)), labels)
            predictions.append(prediction)
        return predictions
    
    def _predict_image(self, image, labels):
        inputs = self._processor(images=image, text=labels, return_tensors="pt", padding=True)
        with torch.no_grad():
            outputs = self._model(**inputs)

        logits = outputs.logits_per_image[0]
        probs = logits.softmax(dim=-1).numpy()
        scores = probs.tolist()

        return scores.index(max(scores))