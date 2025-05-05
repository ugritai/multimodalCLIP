from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser
from django.http import JsonResponse, HttpResponse
from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
from sklearn.metrics import classification_report
from PIL import Image
from io import BytesIO, StringIO
from typing import List

from transformers import CLIPProcessor, CLIPModel
import io
import torch
import json
import requests
import pandas as pd

device = "cuda" if torch.cuda.is_available() else "cpu"
checkpoint = "openai/clip-vit-large-patch14"
zeroshot_model = AutoModelForZeroShotImageClassification.from_pretrained(checkpoint)
zeroshot_processor = AutoProcessor.from_pretrained(checkpoint)

fewshot_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
fewshot_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

class ZeroTwoPredictor:
    def __init__(self):
        checkpoint = "openai/clip-vit-large-patch14"
        self.model = AutoModelForZeroShotImageClassification.from_pretrained(checkpoint)
        self.processor = AutoProcessor.from_pretrained(checkpoint)

    def predict(self, image, labels):
            inputs = self.processor(images=image, text=labels, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = self.model(**inputs)

            logits = outputs.logits_per_image[0]
            probs = logits.softmax(dim=-1).numpy()
            scores = probs.tolist()

            return scores.index(max(scores))
    
class ImageClassification:
    url : str
    description : str
    label : int
    def __init__(self, url, label, description):
        self.url = url
        self.label = label
        self.description = description

def compute_accuracy(images, labels):
    predictor = ZeroTwoPredictor()
    predictions = list()
    for i in range(len(images)):
        req_content = requests.get(images[i].url).content
        prediction = predictor.predict(Image.open(BytesIO(req_content)), labels)
        predictions.append(prediction)
    img_labels = [img.label for img in images]
    print(f'Samples: {len(images)}')
    print(f'Labels: {labels}')
    print(f'Accuracy: {classification_report(img_labels, predictions, target_names=labels)}')
    return predictions
    

# Create your views here.
@api_view(['POST'])
@parser_classes([MultiPartParser])
def classify_image(request):
    res = dict()
    labels=json.loads(request.POST.get("labels"))  
    descriptions=request.POST.get("descriptions")
    files = request.FILES
    for f in files:
        try:
            image = Image.open(io.BytesIO(files[f].read()))
            inputs = zeroshot_processor(images=image, text=labels, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = zeroshot_model(**inputs)

            logits = outputs.logits_per_image[0]
            probs = logits.softmax(dim=-1).numpy()
            scores = probs.tolist()

            result = [
                {"score": float(score), "label": candidate_label}
                for score, candidate_label in sorted(zip(probs, labels), key=lambda x: -x[0])
            ]
        except:
            res[f] = None
        else:
            res[f] = result
    return JsonResponse(res)

# Create your views here.
@api_view(['POST'])
@parser_classes([MultiPartParser])
def zero_shot_prediction(request):
    res = dict()
    labels=json.loads(request.POST.get("labels"))
    descriptions=json.loads(request.POST.get("descriptions"))
    files = request.FILES
    for f in files:
        try:
            image = Image.open(io.BytesIO(files[f].read()))
            inputs = zeroshot_processor(images=image, text=labels, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = zeroshot_model(**inputs)

            logits = outputs.logits_per_image[0]
            probs = logits.softmax(dim=-1).numpy()
            scores = probs.tolist()

            result = [
                {"score": float(score), "label": candidate_label}
                for score, candidate_label in sorted(zip(probs, labels), key=lambda x: -x[0])
            ]
        except:
            res[f] = None
        else:
            res[f] = result
    return JsonResponse(res)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def predict_csv(request : HttpResponse):
    res = dict()
    class_column=request.POST.get("class_column")
    text_column=request.POST.get("text_column")
    image_column=request.POST.get("image_column")
    delimiter = request.POST.get("delimiter", '\t')
    sample_size = int(request.POST.get("sample_size"))
    predictor = request.POST.get("predictor")
    interpolation = request.POST.get("interpolation")
    class_descriptions=request.POST.get("class_descriptions")
    class_descriptions=json.loads(class_descriptions)
    csv_file = request.FILES['csv_file']

    df = pd.read_table(csv_file, delimiter=delimiter, index_col=False)
    dfg = df.groupby(class_column)
    df_sample = dfg.sample(int(sample_size/dfg.ngroups))
    images = df_sample.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
    predictions = compute_accuracy(images, class_descriptions)
    true_labels = [x for x in df_sample[class_column]]
    res["predictions"]=predictions
    res["true_labels"]=true_labels
    res["report"]=classification_report(true_labels, predictions, target_names=class_descriptions, output_dict=True)
    return JsonResponse(res, safe=False)


@api_view(['POST'])
@parser_classes([MultiPartParser])
def few_shot_csv(request : HttpResponse):
    res = dict()
    predictions = []
    class_column=request.POST.get("class_column")
    text_column=request.POST.get("text_column")
    image_column=request.POST.get("image_column")
    delimiter = request.POST.get("delimiter", '\t')
    sample_size = int(request.POST.get("sample_size"))
    reference_sample_size = int(request.POST.get("reference_sample_size"))
    interpolation = request.POST.get("interpolation")
    class_descriptions=request.POST.get("class_descriptions")
    class_descriptions=json.loads(class_descriptions)
    csv_file = request.FILES['csv_file']
    
    df = pd.read_table(csv_file, delimiter=delimiter, index_col=False)
    dfg = df.groupby(class_column)
    df_reference = dfg.sample(int(reference_sample_size/dfg.ngroups))
    reference_images = df_reference.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
    reference_embeddings = get_combined_embeddings(reference_images, interpolation)

    df_prediction = dfg.sample(int(sample_size/dfg.ngroups))
    prediction_images = df_prediction.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
    prediction_embeddings = get_combined_embeddings(prediction_images, interpolation)

    for embedding in prediction_embeddings:
        similarities = torch.nn.functional.cosine_similarity(embedding, reference_embeddings)
        most_similart_idx = similarities.argmax().item()
        predicted_label = reference_images[most_similart_idx].label
        predictions.append(predicted_label)

    true_labels = [x for x in df_prediction[class_column]]
    res["predictions"]=predictions
    res["true_labels"]=true_labels
    res["report"]=classification_report(true_labels, predictions, target_names=class_descriptions, output_dict=True)
    return JsonResponse(res, safe=False)


def get_combined_embeddings(dataset : List[ImageClassification], interpolation : str):
    texts = []
    images = []
    for row in dataset:
        req_content = requests.get(row.url).content
        images.append(Image.open(BytesIO(req_content)))
        texts.append(row.description)
    reference_inputs = fewshot_processor(text=texts, images=images, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        reference_ouputs = fewshot_model(**reference_inputs)

    reference_image_embeddings = reference_ouputs.image_embeds
    reference_text_embeddings = reference_ouputs.text_embeds

    return combine_embeddings(reference_image_embeddings, reference_text_embeddings, interpolation)

def combine_embeddings(image_embeddings, text_embeddings, inteporlation : str):
    interpolation = inteporlation.lower()
    if inteporlation == "sum":
        return image_embeddings + text_embeddings
    elif inteporlation == "average":
        return (image_embeddings + text_embeddings)/2
    elif inteporlation == "multiplicative":
        return (image_embeddings * text_embeddings)
    else:
        raise Exception(f"Combine method {interpolation} not allowed")

