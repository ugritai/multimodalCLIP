import React, { useEffect, useState } from 'react';
import { CsvLoader } from "@/components/CsvLoader";
import { PapaparseTablePrinter } from "@/components/PapaparseTablePrinter";
import { ComboBoxCollection } from '@/components/visualizationPage/ComboBoxCollection';
import { Button } from '@/components/ui/button';
const imgplustextPredidctor = 'image+text'
const imgPredictor = 'image'
const textPredictor = 'text'
const predictors = [imgplustextPredidctor , imgPredictor, textPredictor]
const interpolations = ['WIP']




export function VisualizationPage(){
    const [classColumn, setClassColumn] = useState("")
    const [textColumn, setTextColumn] = useState("")
    const [imageColumn, setImageColumn] = useState("")
    const [predictor, setPredictor] = useState(predictors[0])
    const [interpolation, setInterpolation] = useState(interpolations[0])
    const [isProcessButtonDisabled, setProcessButtonDisabled] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [error, setError] = useState(null);
    const [uniqueClassValues, setUniqueClassValues] = useState<string[]>([]);
    const [classDefinitions, setClassDefinitions] = useState<any>(null);
    
    const onClick = async () => {
        setProcessButtonDisabled(true)
        
        setProcessButtonDisabled(false)
    }

    useEffect(() => {
        if(selectedFile && classColumn){
            let uniqueValues: string[] = [];
            selectedFile.map((row:any, index:any) => {
                if(uniqueValues.indexOf(row[classColumn]) === -1){
                    uniqueValues.push(row[classColumn])
                }
            });
            setUniqueClassValues(uniqueValues);
            console.log(uniqueValues)
        }
        else{
            setUniqueClassValues([])
        }
    }, [classColumn])

    const canPressButton = () => {
        return (predictor == imgplustextPredidctor && classColumn && textColumn && imageColumn && interpolation) ||
        (predictor == imgPredictor && classColumn && imageColumn && interpolation) ||
        (predictor == textPredictor && classColumn && textColumn && interpolation);
    }

    return (
        <div className="bg-primary text-primary-foreground">
            <CsvLoader setData={setSelectedFile} setHeaders={setHeaders} setError={setError}/>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {selectedFile && (
                <div>
                    <PapaparseTablePrinter headers={headers} data={selectedFile} nElements={3}/>
                    <ComboBoxCollection 
                        headers={headers} 
                        predictors={predictors} 
                        interpolation={interpolations}
                        uniqueClasses={uniqueClassValues}
                        setClassColumn={setClassColumn} 
                        setTextColumn={setTextColumn} 
                        setImageColumn={setImageColumn} 
                        setPredictorColumn={setPredictor} 
                        setInterpolationColumn={setInterpolation}/>
                </div>
            )}
            {canPressButton() && (
                <Button disabled={isProcessButtonDisabled} onClick={onClick} variant="outline" className="text-foreground justify-between">
                    Process
                </Button>
            )}
        </div>
    )
}