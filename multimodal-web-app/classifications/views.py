from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser
from django.http import JsonResponse
from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
from sklearn.metrics import classification_report
from PIL import Image
from io import BytesIO
import io
import torch
import json
import requests

checkpoint = "openai/clip-vit-large-patch14"
model = AutoModelForZeroShotImageClassification.from_pretrained(checkpoint)
processor = AutoProcessor.from_pretrained(checkpoint)

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
    title : str
    label : int
    def __init__(self, url, label, title):
        self.url = url
        self.label = label
        self.title = title

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
            inputs = processor(images=image, text=labels, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = model(**inputs)

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
            inputs = processor(images=image, text=labels, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = model(**inputs)

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





