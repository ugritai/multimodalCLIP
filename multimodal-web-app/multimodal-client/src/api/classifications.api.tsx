import axios from 'axios'
import { history } from '../router';
import { ClassificationUploadRequest } from '@/types/ClassificationModel';

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

export const UserClassifications = (username :string) => {
    return api.get(`/classifications/user/${username}/`);
}

export const DatasetClassifications = (dataset_id :number) => {
    return api.get(`/classifications/dataset/${dataset_id}/`);
}

export const UploadClassification = (classification_request : ClassificationUploadRequest) => {
    return api.post('/classifications/classify_dataset/', classification_request, {headers:{"Content-Type":"application/json"}})
}

export const ClassificationInfo = (clasification_id : number) => {
    return api.get(`/classifications/${clasification_id}/info/`);
}

export const ClassificationResult = (clasification_id : number) => {
    return api.get(`/classifications/${clasification_id}/result/`);
}

export const DeleteClassification = (clasification_id : number) => {
    return api.delete(`/classifications/${clasification_id}/delete/`);
}