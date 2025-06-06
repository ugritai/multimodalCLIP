import { SnippetDataset } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Papa from 'papaparse';
import { PapaparseTablePrinter } from "@/components/visualizationPage/PapaparseTablePrinter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NewClassificationModal } from "@/components/datasetPage/newClassificationModal";
import { Classification } from "@/types/ClassificationModel";
import { DatasetClassifications, UserClassifications } from "@/api/classifications";
import { TableWithDelete } from "@/components/common/TableWithDelete";


export function DatasetPage(){
    const displayHeaders :Record<string,string> = 
    {
        dataset: "Dataset",
        update_date: "Fecha",
        status: "Estado",
        model_name: "Modelo",
    }
    const {dataset_id} = useParams();
    const [snippet, setSnippet] = useState<any>(null);
    const [newClassShowModal, setNewClassShowModal] = useState<boolean>(false);
    const [reloadClassifications, setReloadClassifications] = useState([]);
    const [classifications, setClassifications] = useState<Classification[] | undefined>(undefined)
    const navigate = useNavigate();
    if(!dataset_id){
        navigate("/404");
        return;
    }
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

    useEffect(() => {
        DatasetClassifications(Number(dataset_id)).then( 
            (data) => {
                setClassifications(data.data);
            }
        )
    }, [reloadClassifications])

    const OnDoubleClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        console.log("double click");
    }

    const OnDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log("delete");
    }

    const ShowDatasetHeaders = (snippet: any) => {
        if(snippet){
            return (
                <div>
                    <p>Añadir nombre del dataset</p>
                    <p>Añadir metadatos del dataset</p>
                    <ScrollArea className="w-full h-96"><PapaparseTablePrinter data={snippet.data} headers={snippet.meta.fields} nElements={5}/>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea >
                </div>
            )
        }
        else{
            return (
                <div className="w-full h-full pr-1">
                    <Skeleton className="w-full h-10 mb-1"/>
                    <Skeleton className="w-full h-10 mb-1"/>
                    <Skeleton className="w-full h-10 mb-1"/>
                </div>
            );
        }
    };
    
    return (
        <div>
            {ShowDatasetHeaders(snippet)}
            <div className="p-1">
                <Button onClick={() => setNewClassShowModal(true)}>
                    + Nueva clasificación
                </Button>
            </div>
            {newClassShowModal &&
                <NewClassificationModal setShowModal={setNewClassShowModal} dataset_id={Number(dataset_id)}/>}
            {classifications === undefined 
                ? <Skeleton className="w-full h-10 mb-1"/>
                : <TableWithDelete 
                        headers={displayHeaders} 
                        data={classifications}
                        onDoubleClick={OnDoubleClick}
                        onDeleteClick={OnDeleteClick}
                        />}
    </div>
    )
}