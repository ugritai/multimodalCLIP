import { PredicionModel } from "@/types/PredictionModel";
import { useEffect, useState } from "react";
import { UserModels } from "@/api/models.api";
import { Skeleton } from "../ui/skeleton";
import { GetDatasetHeaders, GetUniqueDescriptions } from "@/api/datasets.api";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { UploadClassification } from "@/api/classifications.api";
import { ClassificationUploadRequest } from "@/types/ClassificationModel";
import { ComboBox } from "../common/ComboBox";

type Props = {
        setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
        dataset_id : number,
}

type ClassificationOptions = {
    mode :string | undefined,
    predictor :string | undefined,
    fusionMethod :string | undefined,
    model_name :string | undefined,
    classColumn :string | undefined,
    descriptions :string[] | undefined,
    textColumn :string | undefined,
    imageColumn :string | undefined,
}

const modes :Record<string,string> = 
{
    image: "Images Only",
    text: "Text Only",
    imageAndText: "Image+Text",
}

const predictors :Record<string,string> = 
{
    zeroshot: "Zero Shot",
    fewshot: "Few Shot",
}

const fusionMethods :Record<string,string> = 
{
    average: "Media",
    sum: "Suma",
    multiplicative: "Multiplicativo"
}

function isEmptyArray(arr: any[] | undefined) {
    return !arr || arr.length === 0;
}

function isValidString(str :string | undefined){
    return str !== undefined && str.trim() !== "";
}

function HasToShowImages(options :ClassificationOptions){
    if(!options.mode){
        return false;
    }
    switch(options.mode){
        case 'imageAndText':
        case 'image':
            return true;
        default:
            return false;
    }
}

function HasToShowText(options :ClassificationOptions){
    if(!options.mode){
        return false;
    }
    
    switch(options.mode){
        case 'imageAndText':
        case 'text':
            return true;
        default:
            return false;
    }
}

function HasDescriptions(options :ClassificationOptions){
    return !isEmptyArray(options.descriptions) && options.descriptions?.every((s) => {return s.trim() !== ""})
}

function CanAccept(options :ClassificationOptions){
    return isValidString(options.mode) &&
        isValidString(options.fusionMethod) &&
        isValidString(options.predictor) &&
        isValidString(options.model_name) &&
        isValidString(options.classColumn) &&
        HasDescriptions(options) &&
        (!HasToShowImages(options) || isValidString(options.imageColumn)) &&
        (!HasToShowText(options) || isValidString(options.textColumn));
}

export function NewClassificationModal(
    {setShowModal, dataset_id} :Props) {
    const username = window.localStorage.getItem("username");
    const [predictionModels, setPredictionModels] = useState<PredicionModel[]>([]);
    const [uniqueClasses, setUniqueClasses] = useState<string[]>();
    const [headers, setHeaders] = useState<string[]>([]);
    const [options, setOptions] = useState<ClassificationOptions>({
        mode :undefined,
        predictor :undefined,
        fusionMethod :undefined,
        model_name : undefined,
        classColumn :undefined,
        descriptions :undefined,
        textColumn :undefined,
        imageColumn :undefined,
    });
    useEffect(() => {
        UserModels(username ?? "").then(
            (data) => {
                setPredictionModels(data.data);
            }
        );
        GetDatasetHeaders(dataset_id).then(
            (data) => {
                setHeaders(data.data);
            }
        );
    }, []);

    const loadUniqueClasses = (classColumn :string) => {
        if(isValidString(classColumn)){
            setUniqueClasses([]);
            GetUniqueDescriptions(dataset_id, classColumn).then(
                (data) => {
                    const descriptions = data.data;
                    setOptions((prev) =>({
                        ...prev,
                        descriptions:new Array(descriptions.length).fill("")
                    }))
                    
                    setUniqueClasses(descriptions);
                }
            )
        }
    }

    const handleConfirm = () => {
        const classificationConfig : ClassificationUploadRequest = {
            dataset_id: dataset_id,
            mode: options.mode,
            predictor: options.predictor,
            fusion_method: options.fusionMethod,
            model_name: options.model_name,
            class_column: options.classColumn,
            descriptions: options.descriptions,
            text_column: options.textColumn,
            image_column: options.imageColumn,
        }
        UploadClassification(classificationConfig)
        .then(() => setShowModal(false))
        .catch(() => alert('No se pudo realizar la clasificacion'))
    };

    const searchValue = (value:string, collection:Record<string,string>) => {
        return Object.entries(collection).find(([_, v]) => v === value)?.[0];
    }

    const getComboBoxes = () => {
        if(isEmptyArray(predictionModels) || isEmptyArray(headers)){
            return <Skeleton className="w-full h-10 mb-1"/>
        }
        else{
            return (
            <div>
                <ComboBox values={Object.values(modes)} defaultText="Modo de predicción" setField={(value) => {setOptions({...options,mode:searchValue(value, modes)})}}/>
                {options.mode && <ComboBox values={Object.values(fusionMethods)} defaultText="Método de fusión" setField={(value) => {setOptions({...options,fusionMethod:searchValue(value, fusionMethods)})}}/>}
                {options.fusionMethod && <ComboBox values={Object.values(predictors)} defaultText="Predictor" setField={(value) => {setOptions({...options,predictor:searchValue(value, predictors)})}}/>}
                {options.predictor && <ComboBox values={predictionModels.map((v) => v.model_name)} defaultText="Modelo" setField={(value) => {setOptions({...options,model_name:value})}}/>}
                {options.model_name && <ComboBox values={headers} defaultText="Clases" setField={(value) => {setOptions({...options,classColumn:value}); loadUniqueClasses(value);}}/>}
                {isValidString(options.classColumn) && 
                    getDescriptionTextBoxes()}
                {HasDescriptions(options) && HasToShowImages(options) &&
                    <ComboBox values={headers} defaultText="Imágenes" setField={(value) => {setOptions({...options,imageColumn:value})}}/>}
                {HasDescriptions(options) && HasToShowText(options) &&
                    <ComboBox values={headers} defaultText="Texto" setField={(value) => {setOptions({...options,textColumn:value})}}/>}
            </div>)
        }
    }

    const updateDescription = (str :string | null, index :number) => {
        if(options.descriptions !== undefined && str !== null){
            const descriptions = [...options.descriptions];
            descriptions[index] = str;
            setOptions((prev) => ({
                ...prev,
                descriptions:descriptions
            }));
        }
    }

    const getDescriptionTextBoxes = () => {
        if(isEmptyArray(uniqueClasses)){
            return <Skeleton className="w-full h-10 mb-1"/>;
        }
        else{
            return (
            <div>
                {uniqueClasses?.map((value:string, index:number) => {
                return (
                <div key={index} className="grid gap-1.5 ml-2 mb-1">
                    <Label>Definition for class {value}</Label>
                    <Textarea placeholder="Type your definition here." onChange={(e) => {updateDescription(e.currentTarget.value, index)}}/>
                </div>)
                })}
            </div>)
        }
    }
    
    return  (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 m-2 max-h-full overflow-auto">
            <h2 className="text-m font-semibold mb-4">Nueva Clasificación</h2>
            {getComboBoxes()}
            <div className="flex gap-1">
                <button
                onClick={handleConfirm}
                className={CanAccept(options) ?
                    "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" :
                    "px-4 py-2 bg-gray-500 text-white rounded"}
                disabled={!CanAccept(options)}
                >
                Confirmar
                </button>
                <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                Cancelar
                </button>
            </div>
            
        </div>
    </div>)
}