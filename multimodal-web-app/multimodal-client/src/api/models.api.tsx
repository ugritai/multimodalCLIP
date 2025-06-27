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

export const UserModels = (username :string) => {
    return api.get(`/prediction_models/${username}/`);
}

export const Deletemodel = (model_id : Number) => {
    return api.delete(`/prediction_models/${model_id}/delete/`);
}

export const UploadModel = (model_name : string) => {
    const data = {
        model_name: model_name
    }
    return api.put('/prediction_models/upload/', data, {headers:{"Content-Type":"application/json"}})
}