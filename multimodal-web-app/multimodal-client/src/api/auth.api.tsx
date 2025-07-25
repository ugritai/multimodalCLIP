import axios from "axios";

const api = axios.create({
    baseURL:"http://127.0.0.1:8000/auth"
})

export const Login =  (username : string, password : string) =>
{
    const json = JSON.stringify({username: username, password: password});
    return api.post("/login/", json, {headers:{'Content-Type':'application/json'}});
}

export const Logout = () =>
{
    const token = window.localStorage.getItem('token');
    window.localStorage.clear();
    return api.post("/logout/", {headers:{'Authorization':'Token' + token}});
}

export const ChangePassword = ( current_password : string, new_password : string) =>
{
    const json = JSON.stringify({current_password: current_password, new_password: new_password});
    const token = window.localStorage.getItem('token');
    window.localStorage.clear();
    return api.post("/password/change/", json,
        {headers:
            {
                'Authorization':'Token' + token,
                'Content-Type':'application/json'
            }});
}