from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse
from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
import io
import torch
import json
from PIL import Image

checkpoint = "openai/clip-vit-large-patch14"
model = AutoModelForZeroShotImageClassification.from_pretrained(checkpoint)
processor = AutoProcessor.from_pretrained(checkpoint)

# Create your views here.
@api_view(['POST'])
@parser_classes([MultiPartParser])
def classify_image(request):
    res = dict()
    labels=json.loads(request.POST.get("labels"))
    descriptions=request.POST.get("descriptions")
    files = request.FILES
    for f in files:
        image = Image.open(io.BytesIO(files[f].read()))
        inputs = processor(images=image, text=[f'this is a photo of {label}' for label in labels], return_tensors="pt", padding=True)
        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits_per_image[0]
        probs = logits.softmax(dim=-1).numpy()
        scores = probs.tolist()

        result = [
            {"score": float(score), "label": candidate_label}
            for score, candidate_label in sorted(zip(probs, labels), key=lambda x: -x[0])
        ]
        res[f] = result
    return JsonResponse(res)


