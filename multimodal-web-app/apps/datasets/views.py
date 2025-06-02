from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser
from django.http import FileResponse, JsonResponse, HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.db import IntegrityError, transaction
from django.contrib.auth.models import User
from apps.datasets.models import Dataset, DatasetTypes
from apps.datasets.serializers import DatasetSerializer
from pathlib import Path
import os
import pandas as pd
from io import BytesIO
from datasets import load_dataset
from datasets.exceptions import DatasetNotFoundError

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
@parser_classes([JSONParser])
def upload_huggingface_dataset(request : HttpResponse):
    if "dataset_name" not in request.data or "config" not in request.data or "split" not in request.data:
        return HttpResponse('Missing field \'dataset_name\', \'config\' or \'split\'', status=400)
    dataset_name = request.data["dataset_name"]
    dataset_config = request.data["config"]
    dataset_split = request.data["split"]
    user = request.user
    try:
        #Check if the dataset exists
        load_dataset(dataset_name, dataset_config, split=dataset_split, streaming=True)
        metadata = {
            "config":dataset_config,
            "split":dataset_split
        }
        dataset = Dataset(user=user, dataset_name=dataset_name, dataset_type=DatasetTypes.HUGGING_FACE.value, separator='', metadata=metadata)
        dataset.save()

        serializer = DatasetSerializer(dataset)
        return JsonResponse(serializer.data, status=201)
    except DatasetNotFoundError as ex:
        return HttpResponse(str(ex), status=404)
    except IntegrityError:
        return HttpResponse(f'The dataset {dataset_name} already exists for this user', status=409)
    except Exception as ex:
        return HttpResponse(ex, status=500)
    
@api_view(['PUT'])
@parser_classes([JsonResponse])
@transaction.atomic
def upload_csv(request : HttpResponse):
    if 'file' not in request.FILES:
        return HttpResponseBadRequest(f'Missing field file')
    file = request.FILES['file']
    user = request.user

    tra = transaction.savepoint()
    try:
        dataset = Dataset(user=user, dataset_name=file.name, dataset_type=DatasetTypes.CSV.value, separator='\t')
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
        df = load_dataset_as_pandas(dataset)
        
        buffer = BytesIO()
        df.sample(min(10, len(df))).to_csv(buffer, header=True, index=False)
        buffer.seek(0)

        return FileResponse(buffer, filename=dataset.dataset_name)
    except Exception as ex:
        print(ex)
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')

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

@api_view(["GET"])
def get_headers(request: HttpResponse, dataset_id):
    try:
        dataset = Dataset.objects.get(dataset_id=dataset_id)
        df = load_dataset_as_pandas(dataset)
    except:
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')
    return JsonResponse(df.columns.tolist(), safe=False)

@api_view(["GET"])
def get_column_unique_values(request: HttpResponse, dataset_id, column_name):
    try:
        dataset = Dataset.objects.get(dataset_id=dataset_id)
        df = load_dataset_as_pandas(dataset)
    except:
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')
    try:
        return JsonResponse(sorted(df[column_name].astype(str).unique().tolist()), safe=False)
    except:
        return HttpResponse(f'Can not get a set of unique values for the column "{column_name}"', status=500)

    

@api_view(['DELETE'])
def delete_dataset(request: HttpResponse, dataset_id):
    try:
        dataset = Dataset.objects.get(dataset_id=dataset_id)
    except:
        return HttpResponseNotFound(f'Dataset {dataset_id} not found')
    
    delete_file(dataset.user.username, dataset.dataset_id, dataset.dataset_name)
    dataset.delete()
    return HttpResponse(status=204)

def load_dataset_as_pandas(dataset: Dataset):
    if dataset.dataset_type == DatasetTypes.CSV.value:
        return load_from_disk(dataset)
    elif dataset.dataset_type == DatasetTypes.HUGGING_FACE.value:
        return load_from_hugging_face(dataset)

def load_from_disk(dataset : Dataset):
    file_path = f'data/{dataset.user.username}/{dataset.dataset_id}/{dataset.dataset_name}'
    if not os.path.exists(file_path):
        raise Exception(f'Dataset {dataset.dataset_name} not found in disk')
    
    df = pd.read_table(file_path, delimiter=dataset.separator, index_col=False)
    return df

def load_from_hugging_face(dataset : Dataset):
    ds = load_dataset(dataset.dataset_name, dataset.metadata['config'], split=dataset.metadata['split'])
    return ds.to_pandas()