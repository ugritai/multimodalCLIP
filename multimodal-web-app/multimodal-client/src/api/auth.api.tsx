import axios from "axios";

export const Login =  (username : string, password : string) =>
{
    const json = JSON.stringify({username: username, password: password})
    return axios.post("http://127.0.0.1:8000/api/v1/token/login", json, {headers:{'Content-Type':'application/json'}})
}