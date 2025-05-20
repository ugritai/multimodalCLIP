import { UserDatasets } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { AddDatasetModal } from "@/components/userDatasetsPage/AddDatasetModal";
import { ConfirmDeleteModal } from "@/components/userDatasetsPage/ConfirmDeleteModal";
import LeftDownAddButton from "@/components/common/AddButtonModal";

export function UserDatasetsPage() {
    
    const {username} = useParams();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [addShowModal, setAddShowModal] = useState(false);
    const [deleteShowModal, setDeleteShowModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState();
    const [datasets, setDatasets] = useState<any[]>([])
    const [reloadDatasets, setReloadDatasets] = useState([]);

    useEffect(() => {
        UserDatasets(username ?? "").then( 
            (data) => {
                setDatasets(data.data);
                setLoading(false)
            }
        )
    }, [reloadDatasets])

    if(isLoading){
        return (<div>Loading...</div>)
    }
    else{
        return (
            <div>
                <h3>User: {username}</h3>
                {datasets && datasets.map((dataset, index) =>(
                    <div key={index}>
                        <div className='rounded-sm bg-amber-200 w-1/2 h-11 relative' 
                        onDoubleClick={() => {navigate(`/dataset/${dataset.dataset_id}`)}}>
                            <span className=" absolute inset-y-2 left-0">{dataset.dataset_name}</span>
                            <div className="absolute inset-y-1 right-1">
                                <Button onClick={() => {setSelectedDataset(dataset);setDeleteShowModal(true);}}><Trash/></Button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isOwner && <LeftDownAddButton onClick={() => setAddShowModal(true)}/>}
                {addShowModal && (
                    <AddDatasetModal setReloadDatasets={setReloadDatasets} setShowModal={setAddShowModal}/>
                )}
                {deleteShowModal && (
                    <ConfirmDeleteModal setReloadDatasets={setReloadDatasets} setShowModal={setDeleteShowModal} dataset={selectedDataset}/>
                )}
            </div>
        )
    }
}