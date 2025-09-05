from transformers import AutoProcessor, AutoModelForZeroShotImageClassification, AutoModel
from apps.classifications.models import ClassificationProcess
from sklearn.metrics import classification_report
from abc import ABC, abstractmethod
from io import BytesIO
from typing import List
from PIL import Image
import requests
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"

class ImageClassification:
    _image : any
    description : str
    label : int
    def __init__(self, image, label, description):
        self._image = image
        self.label = label
        self.description = description

    def get_image(self):
        if isinstance(self._image, str):
            req_content = requests.get(self._image, timeout=2).content
            return Image.open(BytesIO(req_content))
        else:
            return Image.open(BytesIO(self._image['bytes']))

class Predictor(ABC):
    def __init__(self, processor, model, classification_process : ClassificationProcess):
        self._processor = processor
        self._model = model
        self._classification_process = classification_process

    @abstractmethod
    def predict():
        pass

    def _get_embeddings(self, dataset : List[ImageClassification], mode :str, interpolation : str):
        if mode == 'text':
            texts = [x.description for x in dataset]
            return self._get_text_embedings(texts)
        elif mode == 'image':
            images = []
            for row in dataset[:]:
                try:
                    images.append(row.get_image())
                except Exception as e:
                    dataset.remove(row)
                    print(f'{e}')
            reference_inputs = self._processor(text=texts, images=images, return_tensors="pt", padding=True, truncation=True).to(device)
            with torch.no_grad():
                reference_ouputs = self._model(**reference_inputs)
            return reference_ouputs.image_embeds
        elif mode == 'image+text':
            return self._get_combined_embeddings(dataset, interpolation)
        
    def _get_text_embedings(self, texts : List[str]):
        reference_inputs = self._processor(text=texts, return_tensors="pt", padding=True, truncation=True).to(device)
        with torch.no_grad():
            return self._model.get_text_features(**reference_inputs)

    def _get_combined_embeddings(self, dataset : List[ImageClassification], interpolation : str):
        texts = []
        images = []
        for row in dataset[:]:
            try:
                images.append(row.get_image())
                texts.append(row.description)
            except Exception as e:
                dataset.remove(row)
                print(f'{e}')

        reference_inputs = self._processor(text=texts, images=images, return_tensors="pt", padding=True, truncation=True).to(device)
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
        
    def _predict_embeddings(self, embeddings, target_embeddings):
        predicted_idx = list()
        for embedding in embeddings:
            similarities = torch.nn.functional.cosine_similarity(embedding, target_embeddings)
            most_similart_idx = similarities.argmax().item()
            predicted_idx.append(most_similart_idx)

        return predicted_idx

        
        
class FewShotPredictor(Predictor):
    def __init__(self, classification_process : ClassificationProcess):
        zeroshot_model = AutoModel.from_pretrained(classification_process.model_name)
        zeroshot_processor = AutoProcessor.from_pretrained(classification_process.model_name)
        super().__init__(zeroshot_processor, zeroshot_model, classification_process)

    def predict(self):
        res = dict()
        predictions = []
        mode = self._classification_process.parameters['mode']
        class_column = self._classification_process.parameters['class_column']
        text_column = self._classification_process.parameters['text_column']
        image_column = self._classification_process.parameters['image_column']
        fusion_method = self._classification_process.parameters['fusion_method']
        class_descriptions = self._classification_process.parameters['descriptions']
        sample_size = self._classification_process.parameters['sample_size']
        reference_sample_size = self._classification_process.parameters['reference_sample_size']
        
        df = self._classification_process.dataset.load_dataset_as_pandas()
        dfg = df.groupby(class_column)
        df_reference = dfg.sample(int(reference_sample_size/dfg.ngroups))
        reference_images = df_reference.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
        reference_embeddings = self._get_embeddings(reference_images, mode, fusion_method)

        df_prediction = dfg.sample(int(sample_size/dfg.ngroups))
        prediction_images = df_prediction.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
        prediction_embeddings = self._get_embeddings(prediction_images, mode, fusion_method)

        predicted_idx = self._predict_embeddings(prediction_embeddings, reference_embeddings)
        predictions = [reference_images[idx].label for idx in predicted_idx]

        true_labels = [x.label for x in prediction_images]
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
        mode = self._classification_process.parameters['mode']
        class_column = self._classification_process.parameters['class_column']
        text_column = self._classification_process.parameters['text_column']
        image_column = self._classification_process.parameters['image_column']
        fusion_method = self._classification_process.parameters['fusion_method']
        class_descriptions = self._classification_process.parameters['descriptions']
        sample_size = self._classification_process.parameters['sample_size']

        df = self._classification_process.dataset.load_dataset_as_pandas()
        dfg = df.groupby(class_column)
        df_sample = dfg.sample(int(sample_size/dfg.ngroups))
        images = df_sample.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
        true_labels = [x for x in df_sample[class_column]]

        prediction_embeddings = self._get_embeddings(images, mode, fusion_method)
        classes_embeddings = self._get_text_embedings(class_descriptions)

        predictions = self._predict_embeddings(prediction_embeddings, classes_embeddings)
        
        res["predictions"]=predictions
        res["true_labels"]=true_labels
        res["report"]=classification_report(true_labels, predictions, target_names=class_descriptions, output_dict=True)
        return res