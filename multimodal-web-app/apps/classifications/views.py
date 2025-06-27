import json
import os
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponseNotFound, JsonResponse, HttpResponse
from apps.core.permissions import owner_or_admin_required
from apps.classifications.models import ClassificationProcess
from apps.classifications.serializers import ClassificationProcessesSerializer, NewClassificationRequestSerializer
from apps.datasets.models import Dataset
from apps.classifications.tasks import predict_dataset
from django.contrib.auth.models import User


def delete_file(username, dataset_id, classification_id):
    directory = f'data/{username}/{dataset_id}'
    filename = f'{directory}/classification_{classification_id}.json'
    if os.path.exists(filename):
        os.remove(filename)
        if len(os.listdir(directory)) == 0:
            os.rmdir(directory)

@api_view(['POST'])
@parser_classes([JSONParser])
def classify_dataset(request):
    serializer = NewClassificationRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return HttpResponse(serializer.errors, status=400)
    
    dataset = Dataset.objects.get(dataset_id = serializer.validated_data['dataset_id'])

    classification_process = ClassificationProcess(
        dataset = dataset, 
        model_name = serializer.validated_data['model_name'], 
        user=request.user,
        parameters = {
            'mode': serializer.validated_data['mode'],
            'predictor': serializer.validated_data['predictor'],
            'fusion_method': serializer.validated_data['fusion_method'],
            'class_column': serializer.validated_data['class_column'],
            'descriptions': serializer.validated_data['descriptions'],
            'text_column': serializer.validated_data['text_column'],
            'image_column': serializer.validated_data['image_column']
        })
    classification_process.save()

    # predict_dataset(classification_id=classification_process.id)

    predict_dataset.delay_on_commit(classification_id=classification_process.id)

    return HttpResponse(status=201)

@api_view(["GET"])
def get_user_classifications(request: HttpResponse, username):
    try:
        user = User.objects.get(username=username)
    except:
        return HttpResponseNotFound(f'user {username} not found')
    classifications = ClassificationProcess.objects.filter(user=user.id).order_by('-update_date')

    serializer = ClassificationProcessesSerializer(classifications, many=True)

    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
def get_dataset_classifications(request: HttpResponse, dataset_id):
    try:
        dataset = Dataset.objects.get(dataset_id=dataset_id)
    except:
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')
    classifications = ClassificationProcess.objects.filter(dataset=dataset).order_by('-update_date')

    serializer = ClassificationProcessesSerializer(classifications, many=True)

    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
def get_classifications_info(request: HttpResponse, classification_id):
    try:
        classification = ClassificationProcess.objects.get(id=classification_id)
    except:
        return HttpResponseNotFound(f'Classification {classification_id} not found')

    serializer = ClassificationProcessesSerializer(classification)

    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
def get_classifications_result(request: HttpResponse, classification_id):
    try:
        classification = ClassificationProcess.objects.get(id=classification_id)
    except:
        return HttpResponseNotFound(f'Classification {classification_id} not found')
    path = f'data/{classification.user}/{classification.dataset.dataset_id}/classification_{classification.id}.json'
    if os.path.exists(path):
        with open(path, 'r') as f:
            data = json.load(f)
            return JsonResponse(data['result'], safe=False)
    else:
        return HttpResponse(status=204)
    
@api_view(['DELETE'])
@owner_or_admin_required(ClassificationProcess, 'classification_id')
def delete_classification(request: HttpResponse, classification_id):
    try:
        classification = ClassificationProcess.objects.get(id=classification_id)
    except:
        return Response({'error': f'Classification {classification_id} not found'}, status=status.HTTP_404_NOT_FOUND)
    
    delete_file(classification.dataset.user.username, classification.dataset.dataset_id, classification.id)
    classification.delete()
    return HttpResponse(status=204)