import { SnippetDataset } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Papa from 'papaparse';
import { PapaparseTablePrinter } from "@/components/visualizationPage/PapaparseTablePrinter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NewClassificationModal } from "@/components/datasetPage/newClassificationModal";


export function DatasetPage(){
    const {dataset_id} = useParams();
    const [snippet, setSnippet] = useState<any>(null);
    const [newClassShowModal, setNewClassShowModal] = useState<boolean>(false);
    const navigate = useNavigate();
    if(dataset_id){
        useEffect(() => {
            SnippetDataset(dataset_id)
            .then((data) => {
                data.data.text()
                .then((text : string) => {
                    const parsedCsv = Papa.parse(text, {header:true});
                    console.log(parsedCsv);
                    setSnippet(parsedCsv);
                })
            })
            .catch((error) => {
                console.log(error);
                navigate("/404");
            });
        }, [])
        return (
            <div>
                {snippet 
                ? <ScrollArea className="w-full h-96"><PapaparseTablePrinter data={snippet.data} headers={snippet.meta.fields} nElements={5}/>
                        <ScrollBar orientation="horizontal" />
                </ScrollArea >
                : <div className="w-full h-full pr-1">
                    <Skeleton className="w-full h-10 mb-1"/>
                    <Skeleton className="w-full h-10 mb-1"/>
                    <Skeleton className="w-full h-10 mb-1"/>
                </div>}
                <div className="p-1">
                    <Button onClick={() => setNewClassShowModal(true)}>
                        + Nueva clasificación
                    </Button>
                </div>
                {newClassShowModal &&
                    <NewClassificationModal setShowModal={setNewClassShowModal} dataset_id={Number(dataset_id)}/>}
        </div>
        )
    }
    else{        
        navigate("/404");
    }
}