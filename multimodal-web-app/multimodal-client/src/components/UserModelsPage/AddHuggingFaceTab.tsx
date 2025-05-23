import { useState } from "react";
import { Input } from "../ui/input";
import { IsValidModel } from "@/api/hugginface.api";
import { UploadModel } from "@/api/models.api";

export function AddHuggingFaceTab(
{
    setReloadDatasets: setReloadModels,
    setShowModal
} : 
{ 
    setReloadDatasets : React.Dispatch<React.SetStateAction<never[]>>,
    setShowModal : React.Dispatch<React.SetStateAction<boolean>>
}){
    
    const enabledButtonStyle = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600";
    const disabledButtonStyle = "px-4 py-2 bg-gray-500 text-white rounded";
    const [hugginFaceModel, setHuggingFaceModel] = useState<string>("");
    const [addButtonDisabled, setAddButtonDisabled] = useState<boolean>(true);
    const [modelNotFound, setModelNotFound] = useState<boolean>(false);

    const handleInputChange = (text :string) => {
        setHuggingFaceModel(text);
        setAddButtonDisabled(Boolean(!text))
    };

    const onClickAdd = async () => {
        setAddButtonDisabled(true);

        const isValid = await IsValidModel(hugginFaceModel);
        if(isValid){
            UploadModel(hugginFaceModel)
            .then( () => {
                    setReloadModels([]);
                    setShowModal(false);
            }).catch((error) => {
                alert("Failed to upload model");
                console.log(error);
            });
            
        }
        else{
            setModelNotFound(true);
        }
        
        setAddButtonDisabled(false);
    }

    return (
        <div className='mb-1'>
            <h2 className="text-xl font-semibold mb-4">Subir modelo de HuggingFace</h2>
            <Input defaultValue={hugginFaceModel} 
                id="hugginFaceInput" 
                type="text" 
                onChange={(e) => handleInputChange(e.target.value)} 
                onPaste={(e) => handleInputChange(e.clipboardData.getData("text"))}/>
            {modelNotFound && <p className="text-red-400">El modelo no existe o es privado</p>}
            <div className="flex gap-1 mt-2">
                <button
                onClick={onClickAdd}
                className={addButtonDisabled ? disabledButtonStyle : enabledButtonStyle}
                disabled={addButtonDisabled}
                >
                Añadir
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