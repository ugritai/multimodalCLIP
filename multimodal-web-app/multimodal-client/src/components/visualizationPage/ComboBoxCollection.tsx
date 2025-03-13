import { ComboBox } from "../ComboBox";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ComboBoxCollection(
    {headers, predictors, interpolation, uniqueClasses, setClassColumn, setTextColumn, setImageColumn, setPredictorColumn, setInterpolationColumn, setClassDefinitions} : 
    {
        headers:string[],
        predictors:string[],
        interpolation:string[],
        uniqueClasses:string[],
        setClassColumn:React.Dispatch<React.SetStateAction<string>>,
        setTextColumn:React.Dispatch<React.SetStateAction<string>>,
        setImageColumn:React.Dispatch<React.SetStateAction<string>>,
        setPredictorColumn:React.Dispatch<React.SetStateAction<string>>,
        setInterpolationColumn:React.Dispatch<React.SetStateAction<string>>,
        setClassDefinitions:React.Dispatch<React.SetStateAction<any>>})
{
    return (
        <div>
            <div className="grid grid-cols-3 w-1/2">
                <div className="flex flex-col w-full p-6 items-center gap-8" >
                    <ComboBox values={headers} defaultText='Class Column' outputValue={setClassColumn}/>
                </div>
                <div className="flex flex-col w-full p-6 items-center gap-8" >
                    <ComboBox values={headers} defaultText='Text Column' outputValue={setTextColumn}/>
                </div>
                <div className="flex flex-col w-full p-6 items-center gap-8" >
                    <ComboBox values={headers} defaultText='Image Column' outputValue={setImageColumn}/>
                </div>
                <div className="flex flex-col w-full p-6 items-center gap-8" >
                    <ComboBox values={predictors} defaultText='Predictor' outputValue={setPredictorColumn}/>
                </div>
                <div className="flex flex-col w-full p-6 items-center gap-8" >
                    <ComboBox values={interpolation} defaultText='Fusion Method' outputValue={setInterpolationColumn}/>
                </div>
            </div>
            {uniqueClasses.length !== 0 && (
                <div>
                {uniqueClasses.map((value:string, index:number) => {
                    let id = `message_${index}`
                    return (<div key={index} className="grid w-1/4 gap-1.5">
                        <Label htmlFor={id}>Definition for class {value}</Label>
                        <Textarea placeholder="Type your definition here." id={id} />
                      </div>)
                })}
                </div>)}
        </div>

    )
}