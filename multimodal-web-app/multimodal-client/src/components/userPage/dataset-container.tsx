import { UserDatasets } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { Trash, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { AddDatasetModal } from "./AddDatasetModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

export function DatasetContainer({username} : {username : string}) {
    
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [addShowModal, setAddShowModal] = useState(false);
    const [deleteShowModal, setDeleteShowModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState();
    const [datasets, setDatasets] = useState<any[]>([])
    const [reloadDatasets, setReloadDatasets] = useState([]);

    useEffect(() => {
        UserDatasets(username).then( 
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
                
                <div className="fixed bottom-4 right-4">
                    <button onClick={() => setAddShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">
                        <Plus/>
                    </button>
                </div>
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