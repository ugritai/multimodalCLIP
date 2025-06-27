from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from apps.core.permissions import owner_or_admin_required
from apps.prediction_models.models import HuggingFaceModel
from apps.prediction_models.serializers import HuggingFaceModelSerializer

# Create your views here.
@api_view(["GET"])
def get_user_models(request: HttpResponse, username):
    try:
        user = User.objects.get(username=username)
    except:
        return HttpResponseNotFound(f'user {username} not found')
    models = HuggingFaceModel.objects.filter(user_id=user.id)

    serializer = HuggingFaceModelSerializer(models, many=True)

    return JsonResponse(serializer.data, safe=False)

@api_view(['PUT'])
@parser_classes([JSONParser])
def upload_model(request : HttpResponse):
    user = request.user
    if "model_name" not in request.data:
        return HttpResponse('Missing field \'model_name\'', status=400)
    model_name = request.data["model_name"]
    dataset = HuggingFaceModel(model_name=model_name, user=user)
    dataset.save()
    return HttpResponse(status=201)

@api_view(['DELETE'])
@parser_classes([JSONParser])
@owner_or_admin_required(HuggingFaceModel, 'model_id')
def delete_model(request : HttpResponse, model_id):
    try:
        model = HuggingFaceModel.objects.get(model_id=model_id)
    except:
        return HttpResponseNotFound(f'Model {model_id} not found')
    model.delete()
    
    return HttpResponse(status=204)