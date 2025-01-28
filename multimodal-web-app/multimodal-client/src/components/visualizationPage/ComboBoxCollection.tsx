import { ComboBox } from "../ComboBox";

export function ComboBoxCollection(
    {headers, predictors, interpolation, setClassColumn, setTextColumn, setImageColumn, setPredictorColumn, setInterpolationColumn} : 
    {
        headers:string[],
        predictors:string[],
        interpolation:string[],
        setClassColumn:React.Dispatch<React.SetStateAction<string>>,
        setTextColumn:React.Dispatch<React.SetStateAction<string>>,
        setImageColumn:React.Dispatch<React.SetStateAction<string>>,
        setPredictorColumn:React.Dispatch<React.SetStateAction<string>>,
        setInterpolationColumn:React.Dispatch<React.SetStateAction<string>>})
{
    return (
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
                <ComboBox values={interpolation} defaultText='Interpolation' outputValue={setInterpolationColumn}/>
            </div>
        </div>
    )
}