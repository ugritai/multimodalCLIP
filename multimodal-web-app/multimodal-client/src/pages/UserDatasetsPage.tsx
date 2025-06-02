import { DeleteDataset, UserDatasets } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddDatasetModal } from "@/components/userDatasetsPage/AddDatasetModal";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import LeftDownAddButton from "@/components/common/AddButtonModal";
import { TableWithDelete } from "@/components/common/TableWithDelete";

type Dataset = {
    dataset_id: Number,
    dataset_name: string,
    upload_date: string,
    dataset_type: string,
    separator: string,
    metadata: string,
    user: Number
}

export function UserDatasetsPage() {
    const displayHeaders :Record<string,string> = 
    {
        dataset_name: "Nombre",
        upload_date: "Fecha de subida",
        dataset_type: "Tipo",
    }
    const {username} = useParams();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [addShowModal, setAddShowModal] = useState(false);
    const [deleteShowModal, setDeleteShowModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState<Dataset>();
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [reloadDatasets, setReloadDatasets] = useState([]);

    useEffect(() => {
        UserDatasets(username ?? "").then( 
            (data) => {
                setDatasets(data.data);
                setLoading(false)
            }
        )
    }, [reloadDatasets])

    const OnDoubleClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        const row = e.currentTarget;
        const dataset_name = row.cells[0]?.textContent;
        const dataset = datasets.find(ds => ds.dataset_name === dataset_name)
        if(dataset){
            navigate(`/dataset/${dataset.dataset_id}`);
        }
        else{
            console.log(`Dataset ${dataset_name} not found`)
        }
    }

    const OnDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.currentTarget;
        const row = button.closest('tr') as HTMLTableRowElement;
        const dataset_name = row.cells[0]?.textContent;
        const dataset = datasets.find(ds => ds.dataset_name === dataset_name)
        setSelectedDataset(dataset);
        setDeleteShowModal(true);
    }

    const deleteDataset = (dataset : Dataset) => {
        DeleteDataset(dataset.dataset_id)
        .then(() => {
            setReloadDatasets([]);
        })
        .catch((error) => {
            alert(`Failed to delete ${dataset.dataset_name}`)
            console.log(error);
        })
    }

    return (
        <div>
            <h1>Datasets de {username}</h1>
            {isLoading
                ? <p>Loading...</p>
                : <TableWithDelete 
                    headers={displayHeaders} 
                    data={datasets}
                    onDoubleClick={OnDoubleClick}
                    onDeleteClick={OnDeleteClick}
                    />
            }
            
            {isOwner && <LeftDownAddButton onClick={() => setAddShowModal(true)}/>}
            {addShowModal && (
                <AddDatasetModal setReloadDatasets={setReloadDatasets} setShowModal={setAddShowModal}/>
            )}
            {deleteShowModal && selectedDataset && (
                <ConfirmDeleteModal<Dataset> setShowModal={setDeleteShowModal} deleteFunction={deleteDataset} elementToDelete={selectedDataset}/>
            )}
        </div>
    )
}