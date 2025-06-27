import { DatasetInfo, SnippetDataset } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Papa from 'papaparse';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NewClassificationModal } from "@/components/datasetPage/newClassificationModal";
import { Dataset } from "@/types/DatasetModel";
import { PapaparseTablePrinter } from "@/components/common/PapaparseTablePrinter";
import { ClassificationsTable } from "@/components/userClassificationsPage/ClassificationsTable";


export function DatasetPage(){
    const {dataset_id} = useParams();
    const [datasetInfo, setDatasetInfo] = useState<Dataset>();
    const [snippet, setSnippet] = useState<any>(null);
    const [newClassShowModal, setNewClassShowModal] = useState<boolean>(false);
    const navigate = useNavigate();
    if(!dataset_id){
        navigate("/404");
        return;
    }

    useEffect(() => {
        DatasetInfo(Number(dataset_id))
        .then((data) => {
            setDatasetInfo(data.data);
        })
        .catch((error) => {
            console.log(error);
            navigate("/404");
        });
    }, []);

    useEffect(() => {
        SnippetDataset(Number(dataset_id))
        .then((data) => {
            data.data.text()
            .then((text : string) => {
                const parsedCsv = Papa.parse(text, {header:true});
                setSnippet(parsedCsv);
            })
        })
        .catch((error) => {
            console.log(error);
            navigate("/404");
        });
    }, [])


    const showDatasetInfo = () => {
        if(datasetInfo){
            return (
                <div>
                    <h1 className="text-2xl font-semibold">Dataset: {datasetInfo.dataset_name}</h1>
                </div>
            );
        }
        else{
            return <div/>
        }
    }

    const ShowDatasetHeaders = (snippet: any) => {
        if(snippet){
            return (
                <div>
                    {showDatasetInfo()}
                    <ScrollArea className="w-full h-96">
                        <PapaparseTablePrinter data={snippet.data} headers={snippet.meta.fields} nElements={5}/>
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
            {datasetInfo
                ? <ClassificationsTable username={datasetInfo.user ?? ""}/>
                : <Skeleton className="w-full h-10 mb-1"/>}
    </div>
    )
}