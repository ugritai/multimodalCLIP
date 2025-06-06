import { Deletemodel, UserModels } from "@/api/models.api";
import LeftDownAddButton from "@/components/common/AddButtonModal";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { TableWithDelete } from "@/components/common/TableWithDelete";
import { AddModelModal } from "@/components/UserModelsPage/AddModelModal";
import { PredicionModel } from "@/types/PredictionModel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function UserModelsPage(){
    const displayHeaders: Record<string, string> = {
        model_name: "Nombre",
        upload_date: "Fecha de subida"
    }
    const {username} = useParams();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
    
    const [isLoading, setLoading] = useState(true);
    const [models, setModels] = useState<PredicionModel[]>([])
    const [addShowModal, setAddShowModal] = useState(false);
    const [deleteShowModal, setDeleteShowModal] = useState(false);
    const [selectedModel, setSelectedModel] = useState<PredicionModel>();
    const [reloadModels, setReloadModels] = useState([]);

    useEffect(() => {
        UserModels(username ?? "").then(
            (data) => {
                setModels(data.data);
                setLoading(false)
            }
        )
    }, [reloadModels]);

    const handleAddClick = () => {
        setAddShowModal(true);
    };
    const handleDoubleClick = () => {
        console.log("Double click!")
    }

    const OnDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.currentTarget;
        const row = button.closest('tr') as HTMLTableRowElement;
        const name = row.cells[0]?.textContent;
        const model = models.find(m => m.model_name === name)
        setSelectedModel(model);
        setDeleteShowModal(true);
    }
    
    const deleteModel = (model : PredicionModel) => {
        Deletemodel(model.model_id)
            .then(() => {
                setReloadModels([]);
            })
            .catch((error) => {
                alert(`Failed to delete ${model.model_id}`)
                console.log(error);
            })
    }

    return (
        <div>
            <h1>Modelos de {username}</h1>
            { isLoading
                ? <p>Loading...</p>
                : <TableWithDelete headers={displayHeaders} data={models} onDeleteClick={OnDeleteClick} onDoubleClick={handleDoubleClick}/>
            }
            {isOwner && <LeftDownAddButton onClick={handleAddClick}/>}
            
            {addShowModal && (
                <AddModelModal setReloadDatasets={setReloadModels} setShowModal={setAddShowModal}/>
            )}
            {deleteShowModal && selectedModel &&(
                <ConfirmDeleteModal<PredicionModel> 
                    setShowModal={setDeleteShowModal} 
                    deleteFunction={deleteModel} 
                    elementToDelete={selectedModel} 
                />
            )}
        </div>
    )
}