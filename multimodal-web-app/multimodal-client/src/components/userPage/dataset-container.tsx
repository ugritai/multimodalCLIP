import { UserDatasets } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function DatasetContainer({username} : {username : string}) {
    
    const [isLoading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [datasets, setDatasets] = useState<any[]>([])
    useEffect(() => {
        UserDatasets(username).then( 
            (data) => {
                setDatasets(data.data);
                setLoading(false)
            }
        )
    }, [])

    const deleteDataset = (dataset : any) => {
        const newDatasets = datasets.filter((item) => item != dataset);
        setDatasets(newDatasets);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        };

    if(isLoading){
        return (<div>Loading...</div>)
    }
    else{
        return (
            <div>
                <h3>User: {username}</h3>
                {datasets && datasets.map((dataset, index) =>(
                    <div key={index}>
                        <div className='inline-flex'>
                            <div className='rounded-sm bg-amber-200' >
                                {dataset.dataset_name} 
                                <Button onClick={() => {deleteDataset(dataset)}}><Trash/></Button>
                            </div>
                        </div>
                        <div className="fixed bottom-4 right-4">
                            <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">
                            +
                        </button>
                        </div>
                    </div>
                ))}
                {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Añadir archivo</h2>
                        <Input id="csvFile" type="file" onChange={handleFileChange}/>
                        <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                        Cerrar
                        </button>
                    </div>
                </div>
                )}
            </div>
        )
    }
}