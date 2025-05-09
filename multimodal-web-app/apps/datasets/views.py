from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from django.http import FileResponse, JsonResponse, HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.db import IntegrityError, transaction
from django.contrib.auth.models import User
from apps.datasets.models import Dataset
from apps.datasets.serializers import DatasetSerializer
from pathlib import Path
import os
import pandas as pd
from io import BytesIO

def save_file(username, dataset_id, filename, data):
    directory = f'data/{username}/{dataset_id}'
    Path(directory).mkdir(parents=True, exist_ok=True)
    with open(f'{directory}/{filename}', 'wb') as file:
        file.write(data)

def delete_file(username, dataset_id, filename):
    directory = f'data/{username}/{dataset_id}'
    if os.path.exists(f'{directory}/{filename}'):
        os.remove(f'{directory}/{filename}')
        if len(os.listdir(directory)) == 0:
            os.rmdir(directory)

@api_view(['PUT'])
@parser_classes([MultiPartParser])
@transaction.atomic
def upload_csv(request : HttpResponse):
    if 'file' not in request.FILES:
        return HttpResponseBadRequest(f'Missing field file')
    file = request.FILES['file']
    user = request.user

    tra = transaction.savepoint()
    try:
        dataset = Dataset(user=user, dataset_name=file.name, dataset_type='csv', separator='\t')
        dataset.save()

        save_file(user.username, dataset.dataset_id, dataset.dataset_name, file.read())

        serializer = DatasetSerializer(dataset)
        return JsonResponse(serializer.data, status=201)
    except IntegrityError:
        delete_file(user.username, dataset.dataset_id, dataset.dataset_name)
        return HttpResponse(f'The dataset {file.name} already exists for this user', status=409)
    except Exception as ex:
        transaction.savepoint_rollback(tra)
        delete_file(user.username, dataset.dataset_id, dataset.dataset_name)
        return HttpResponse(ex, status=500)

@api_view(["GET"])
def get_user_datasets(request: HttpResponse, username):
    try:
        user = User.objects.get(username=username)
    except:
        return HttpResponseNotFound(f'user {username} not found')
    datasets = Dataset.objects.filter(user_id=user.id)

    serializer = DatasetSerializer(datasets, many=True)

    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
def get_dataset_snippet(request: HttpResponse, dataset_id):
    try:
        dataset = Dataset.objects.get(dataset_id=dataset_id)
    except:
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')
    file_path = f'data/{dataset.user.username}/{dataset.dataset_id}/{dataset.dataset_name}'
    if not os.path.exists(file_path):
        return HttpResponseNotFound(f'Dataset {dataset.dataset_name} not found in disk')
    
    df = pd.read_table(file_path, delimiter=dataset.separator, index_col=False)
    buffer = BytesIO()
    df.sample(min(10, len(df))).to_csv(buffer, header=True, index=False)
    buffer.seek(0)

    return FileResponse(buffer, filename=dataset.dataset_name)

@api_view(["GET"])
def download_dataset(request: HttpResponse, dataset_id):
    try:
        dataset = Dataset.objects.get(dataset_id=dataset_id)
    except:
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')
    file_path = f'data/{dataset.user.username}/{dataset.dataset_id}/{dataset.dataset_name}'
    if not os.path.exists(file_path):
        return HttpResponseNotFound(f'Dataset {dataset.dataset_name} not found in disk')
    return FileResponse(open(file_path, 'rb'), as_attachment=True)

@api_view(['DELETE'])
def delete_dataset(request: HttpResponse, dataset_id):
    try:
        dataset = Dataset.objects.get(dataset_id=dataset_id)
    except:
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')
    
    delete_file(dataset.user.username, dataset.dataset_id, dataset.dataset_name)
    dataset.delete()
    return HttpResponse(status=204)