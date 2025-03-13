import { useEffect, useState } from 'react';
import { CsvLoader } from "@/components/visualizationPage/CsvLoader";
import { PapaparseTablePrinter } from "@/components/visualizationPage/PapaparseTablePrinter";
import { ComboBoxCollection } from '@/components/visualizationPage/ComboBoxCollection';
import { Button } from '@/components/ui/button';
import { ReportCharts } from '@/components/visualizationPage/ReportCharts';
import { predictCsv } from '@/api/predicts.api.js';


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
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [csvFile, setCsvFile] = useState<File>();
    const [headers, setHeaders] = useState<string[]>([]);
    const [error, setError] = useState(null);
    const [uniqueClassValues, setUniqueClassValues] = useState<string[]>([]);
    const [classDefinitions, setClassDefinitions] = useState<string[]>(["This new is fake","This new is true"]);
    const [charData, setChartData] = useState<any>(null);

    
    const onClick = async () => {
        try{
            setProcessButtonDisabled(true);
            const response = await predictCsv(classColumn, 
                textColumn,
                imageColumn,
                predictor,
                interpolation, 
                JSON.stringify(classDefinitions), 
                20, 
                csvFile);
            console.log(response.data.report)
            let precision = { label: "Precision", class_0: 0.1, class_1: 0.5 };
            let recall = { label: "Recall", class_0: 0.1, class_1: 0.5 };
            let f1 = { label: "F-1", class_0: 0.5, class_1: 0.1 };
            classDefinitions.map((value, index) => {
                precision[value] = response.data.report[value]['precision'];
                recall[value] = response.data.report[value]['recall'];
                f1[value] = response.data.report[value]['f1-score'];
            });
            setChartData([precision, recall, f1]);
        }
        finally{
            setProcessButtonDisabled(false)
        }
    }

    useEffect(() => {
        if(selectedFile && classColumn){
            let uniqueValues: string[] = [];
            selectedFile.map((row:any, _:any) => {
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
        <div className="bg text-primary">
            <CsvLoader setData={setSelectedFile} setCsvFile={setCsvFile} setHeaders={setHeaders} setError={setError}/>
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
                        setInterpolationColumn={setInterpolation}
                        setClassDefinitions={setClassDefinitions}
                        />
                </div>
            )}
            {canPressButton() && (
                <Button disabled={isProcessButtonDisabled} onClick={onClick} variant="outline" className="text-foreground justify-between">
                    Process
                </Button>
            )}
            {charData && <ReportCharts classes={classDefinitions} chartData={charData}/>}
        </div>
    )
}