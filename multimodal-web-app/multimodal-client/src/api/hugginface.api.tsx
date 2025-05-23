import axios from 'axios'

export interface Split{
    dataset:string,
    config:string,
    split:string,
}

const api = axios.create();
const defaultBaseUri = "https://huggingface.co";
const datasetBaseUri = "https://datasets-server.huggingface.co";

export const IsValidDataset = async (dataset : string) => {
    try{
        return await api.get(`${datasetBaseUri}/is-valid?dataset=${dataset}`)
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
    const response = await api.get(`${datasetBaseUri}/splits?dataset=${dataset}`);
    const splits : Split[] = response.data.splits;
    return splits;
}

export const IsValidModel = async (model_name : string) => {
    try{
        return await api.get(`${defaultBaseUri}/api/models/${model_name}`)
            .then(() => {
                console.log("true");
                return true;
            })
            .catch(() => {
                console.log("false");
                return false;
            });
    }
    catch{
        return false;
    }
}