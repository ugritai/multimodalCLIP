import axios from "axios";

const api = axios.create({
    baseURL:"http://127.0.0.1:8000/api/v1/token"
})

export const Login =  (username : string, password : string) =>
{
    const json = JSON.stringify({username: username, password: password});
    return api.post("/login", json, {headers:{'Content-Type':'application/json'}});
}

export const Logout = () =>
{
    const token = window.localStorage.getItem('token');
    window.localStorage.clear();
    return api.post("/login", {headers:{'Authorization':'Token' + token}});
}