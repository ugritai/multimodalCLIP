import axios from 'axios'
import { history } from '../router';

const api = axios.create({
    baseURL:"http://127.0.0.1:8000"
})

api.interceptors.request.use(
    config => {
        const token = window.localStorage.getItem('token')
        if(token){
            config.headers['Authorization'] = 'Token ' + token
        }
        return config;
    },
    error => {
      Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => response,
    error => {
        if(error.response?.status === 401) {
            window.localStorage.clear();
            history.push('/login');
        }
    }
)

export const UserDatasets = (username :string) => {
    return api.get(`/datasets/${username}/`);
}

export const DeleteDataset = (dataset_id : number) => {
    return api.delete(`/datasets/${dataset_id}/delete/`);
}

export const DownloadDataset = (dataset_id : number) => {
    return api.get(`/datasets/${dataset_id}/download/`, {responseType: "blob"});
}

export const DatasetInfo = (dataset_id : number) => {
    return api.get(`/datasets/${dataset_id}/info/`);
}

export const SnippetDataset = (dataset_id : number) => {
    return api.get(`/datasets/${dataset_id}/snippet/`, {responseType: "blob"});
}

export const GetDatasetHeaders = (dataset_id : number) => {
    return api.get(`/datasets/${dataset_id}/headers/`)
}

export const GetUniqueDescriptions = (dataset_id : number, class_column :string) => {
    return api.get(`/datasets/${dataset_id}/unique_values/${class_column}`)
}

export const UploadDataset = (dataset : File, dataset_private : boolean) => {
    const formData = new FormData();
    formData.append('file', dataset);
    formData.append('private', dataset_private.toString());
    return api.put('/datasets/upload_csv/', formData, {headers:{"Content-Type":"multipart/form-data"}})
}

export const UploadHuggingFaceDataset = (dataset :string, config :string, split :string) => {
    const data = {
        dataset_name : dataset,
        config: config,
        split: split,
    }
    return api.put('/datasets/upload_huggingface/', data, {headers:{"Content-Type":"application/json"}})
}