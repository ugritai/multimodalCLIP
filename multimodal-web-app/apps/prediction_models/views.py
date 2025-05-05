from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from apps.prediction_models.models import HuggingFaceModel
from apps.prediction_models.serializers import HuggingFaceModelSerializer

# Create your views here.
@api_view(["GET"])
def get_all_models(request: HttpResponse):
    models = HuggingFaceModel.objects.all()
    serializer = HuggingFaceModelSerializer(models, many=True)

    return JsonResponse(serializer.data, safe=False)

@api_view(['PUT'])
@parser_classes([JSONParser])
def upload_model(request : HttpResponse):
    if "model_name" not in request.data:
        return HttpResponse('Missing field \'model_name\'', status=400)
    model_name = request.data["model_name"]
    dataset = HuggingFaceModel(model_name=model_name)
    dataset.save()
    return HttpResponse(status=201)

@api_view(['DELETE'])
@parser_classes([JSONParser])
def delete_model(request : HttpResponse):
    if "model_name" not in request.data:
        return HttpResponse('Missing field \'model_name\'', status=400)
    model_name = request.data["model_name"]

    try:
        model = HuggingFaceModel.objects.get(model_name=model_name)
    except:
        return HttpResponseNotFound(f'Model {model_name} not found')
    
    model.delete()
    
    return HttpResponse(status=204)