import { useState } from "react";
import { Input } from "../ui/input";
import { GetSplits, IsValidDataset, Split } from "@/api/hugginface.api";
import { UploadHuggingFaceDataset } from "@/api/datasets.api";

export function AddHuggingFaceTab(
{
    setReloadDatasets,
    setShowModal
} : 
{ 
    setReloadDatasets : React.Dispatch<React.SetStateAction<never[]>>,
    setShowModal : React.Dispatch<React.SetStateAction<boolean>>
}){
    
    const enabledButtonStyle = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600";
    const disabledButtonStyle = "px-4 py-2 bg-gray-500 text-white rounded";
    const [hugginFaceModel, setHuggingFaceModel] = useState<string>("");
    const [searchButtonDisabled, setSearchButtonDisabled] = useState<boolean>(true);
    const [splits, setSplits] = useState<Split[]>([]);
    const [datasetNotFound, setDatasetNotFound] = useState<boolean>(false);
    const handleInputChange = (text :string) => {
        setHuggingFaceModel(text);
        setSearchButtonDisabled(Boolean(!text))
    };

    const onClickSearch = async () => {
        setSearchButtonDisabled(true);

        const isValid = await IsValidDataset(hugginFaceModel);
        if(isValid){
            setSplits(await GetSplits(hugginFaceModel));
            setDatasetNotFound(false);
            
        }
        else{
            setSplits([]);
            setDatasetNotFound(true);
        }
        
        setSearchButtonDisabled(false);
    }

    const onClickDataset = async (split :Split) => {
        await UploadHuggingFaceDataset(split.dataset, split.config, split.split);
        setReloadDatasets([]);
        setShowModal(false);
    }

    return (
        <div className='mb-1'>
            <h2 className="text-xl font-semibold mb-4">Subir dataset de HuggingFace</h2>
            <Input defaultValue={hugginFaceModel} 
                id="hugginFaceInput" 
                type="text" 
                onChange={(e) => handleInputChange(e.target.value)} 
                onPaste={(e) => handleInputChange(e.clipboardData.getData("text"))}/>
            {datasetNotFound && <p className="text-red-400">El Dataset no existe o es privado</p>}
            {Boolean(splits?.length) &&
            <div className='mb-1'>
                Splits Disponibles:
                {splits.map((split, index) => {
                    return (<button key={index}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full mt-1"
                                onClick={() => onClickDataset(split)}>
                            <p>Config: {split.config}</p><p>Split: {split.split}</p>
                        </button>)
                })}
            </div>
            }
            <div className="flex gap-1 mt-2">
                <button
                onClick={onClickSearch}
                className={searchButtonDisabled ? disabledButtonStyle : enabledButtonStyle}
                disabled={searchButtonDisabled}
                >
                Buscar
                </button>
                <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                Cerrar
                </button>
            </div>
        </div>
    )
}