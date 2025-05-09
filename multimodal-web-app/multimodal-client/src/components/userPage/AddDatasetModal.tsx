import { useState } from "react"
import { Input } from "../ui/input"
import { UploadDataset } from "@/api/datasets.api";

export function AddDatasetModal(
{
    setReloadDatasets,
    setShowModal
} : 
{ 
    setReloadDatasets : React.Dispatch<React.SetStateAction<never[]>>,
    setShowModal : React.Dispatch<React.SetStateAction<boolean>>
}) 
{
    const enabledButtonStyle = "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600";
    const disabledButtonStyle = "px-4 py-2 bg-gray-500 text-white rounded";
    const [file, setFile] = useState<File>();
    const [addButtonDisabled, setAddButtonDisabled] = useState<boolean>(true);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
            setAddButtonDisabled(false);
        }
        else{
            setAddButtonDisabled(true);
        }
    };
    const addDataset = () => {
        if(file){
            UploadDataset(file)
            .then(() => {
                setReloadDatasets([]);
                setShowModal(false);
            })
            .catch((error) => {
                alert('Failed to upload file');
                console.log(error);
            });
        }
    };
    return  (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Añadir archivo</h2>
            <Input id="csvFile" type="file" onChange={handleFileChange}/>
            <button
            onClick={() => addDataset()}
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
    </div>)
}