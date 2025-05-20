import { SnippetDataset } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Papa from 'papaparse';
import { PapaparseTablePrinter } from "@/components/visualizationPage/PapaparseTablePrinter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


export function DatasetPage(){
    const {dataset_id} = useParams();
    const [snippet, setSnippet] = useState<any>(null);
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
            
        <ScrollArea className="w-full h-96">
            {snippet && <PapaparseTablePrinter data={snippet.data} headers={snippet.meta.fields} nElements={5}/>}
            
            <ScrollBar orientation="horizontal" />
        </ScrollArea >
        )
    }
    else{        
        navigate("/404");
    }
}