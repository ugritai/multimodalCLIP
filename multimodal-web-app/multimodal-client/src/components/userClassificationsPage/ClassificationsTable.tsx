import { DeleteClassification, UserClassifications } from "@/api/classifications.api";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { TableWithDelete } from "@/components/common/TableWithDelete";
import { Classification } from "@/types/ClassificationModel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
        username : string,
}

export function ClassificationsTable(
    {username} :Props){
    const displayHeaders :Record<string,string> = 
    {
        dataset: "Dataset",
        update_date: "Fecha",
        status: "Estado",
        model_name: "Modelo",
    }
    const navigate = useNavigate();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
        
    const [isLoading, setLoading] = useState(true);
    const [classifications, setClassifications] = useState<Classification[]>([])
    const [deleteShowModal, setDeleteShowModal] = useState(false);
    const [selectedClassification, setSelectedClassification] = useState<Classification>();
    const [reloadClassifications, setReloadClassifications] = useState([]);

    useEffect(() => {
        UserClassifications(username ?? "").then( 
            (data) => {
                setClassifications(data.data);
                setLoading(false)
            }
        )
    }, [reloadClassifications])

    const OnDoubleClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        const row = e.currentTarget;
        const dataset_name = row.cells[0]?.textContent;
        const timestamp = row.cells[1]?.textContent;
        const classification = classifications.find(m => m.dataset === dataset_name && m.update_date === timestamp)
        if(classification){
            navigate(`/classification/${classification.id}`);
        }
        else{
            console.log(`Classification not found`)
        }
    }

    const OnDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.currentTarget;
        const row = button.closest('tr') as HTMLTableRowElement;
        const dataset_name = row.cells[0]?.textContent;
        const timestamp = row.cells[1]?.textContent;
        const classification = classifications.find(m => m.dataset === dataset_name && m.update_date === timestamp)
        console.log(classification)
        setSelectedClassification(classification);
        setDeleteShowModal(true);
    }
    
    const deleteClassification = (classification : Classification) => {
        DeleteClassification(classification.id)
            .then(() => {
                setReloadClassifications([]);
            })
            .catch((error) => {
                alert(`Failed to delete ${classification.id}`)
                console.log(error);
            })
    }
    
    return (
        <div>
            {isLoading
                ? <p>Loading...</p>
                : <TableWithDelete 
                    headers={displayHeaders} 
                    data={classifications}
                    isOwner={isOwner}
                    onDoubleClick={OnDoubleClick}
                    onDeleteClick={OnDeleteClick}
                    />
            }
            {deleteShowModal && selectedClassification &&(
                <ConfirmDeleteModal<Classification> 
                    setShowModal={setDeleteShowModal} 
                    deleteFunction={deleteClassification} 
                    elementToDelete={selectedClassification} 
                />
            )}
        </div>
    )
}