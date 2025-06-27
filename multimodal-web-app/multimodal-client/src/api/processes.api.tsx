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

export const UserProcesses = (username :string) => {
    return api.get(`/processes/${username}/`);
}