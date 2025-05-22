import axios from 'axios'

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

export const UserDatasets = (username :string) => {
    return api.get(`/datasets/${username}/`);
}

export const DeleteDataset = (dataset_id : Number) => {
    return api.delete(`/datasets/${dataset_id}/delete/`);
}

export const DownloadDataset = (dataset_id : string) => {
    return api.get(`/datasets/${dataset_id}/download/`, {responseType: "blob"});
}

export const SnippetDataset = (dataset_id : string) => {
    return api.get(`/datasets/${dataset_id}/snippet/`, {responseType: "blob"});
}

export const UploadDataset = (dataset : File) => {
    const formData = new FormData();
    formData.append('file', dataset);
    return api.put('/datasets/upload/', formData, {headers:{"Content-Type":"multipart/form-data"}})
}

export const UploadHuggingFaceDataset = (dataset :string, config :string, split :string) => {
    const data = {
        dataset_name : dataset,
        config: config,
        split: split,
    }
    return api.put('/datasets/upload_huggingface/', data, {headers:{"Content-Type":"application/json"}})
}