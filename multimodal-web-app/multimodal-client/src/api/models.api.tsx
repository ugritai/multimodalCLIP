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

export const UserModels = (username :string) => {
    return api.get(`/models/${username}/`);
}