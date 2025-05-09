import { SnippetDataset } from "@/api/datasets.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Papa from 'papaparse';
import { PapaparseTablePrinter } from "@/components/visualizationPage/PapaparseTablePrinter";


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
            <div>{snippet && <PapaparseTablePrinter data={snippet.data} headers={snippet.meta.fields} nElements={5}/>}
            </div>
        )
    }
    else{        
        navigate("/404");
    }
}