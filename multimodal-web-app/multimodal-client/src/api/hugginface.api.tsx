import axios from 'axios'

export interface Split{
    dataset:string,
    config:string,
    split:string,
}

const api = axios.create({
    baseURL:"https://datasets-server.huggingface.co"
})

export const IsValid = async (dataset : string) => {
    try{
        return await api.get(`/is-valid?dataset=${dataset}`)
            .then((response) => {
                for (const property in response.data){
                    if (response.data[property] === true){
                        return true;
                    }
                }
                return false;
            })
            .catch(() => {
                return false;
            });
    }
    catch{
        return false;
    }
}

export const GetSplits = async (dataset : string) => {
    const response = await api.get(`/splits?dataset=${dataset}`);
    const splits : Split[] = response.data.splits;
    return splits;
}