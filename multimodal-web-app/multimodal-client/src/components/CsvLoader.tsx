import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Papa from 'papaparse';

export function CsvLoader(
        {setData, setHeaders, setError} :
        {setData : React.Dispatch<React.SetStateAction<null>>,
        setHeaders : React.Dispatch<React.SetStateAction<string[]>>,
        setError : React.Dispatch<React.SetStateAction<null>>})
    {
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
          parseCSV(selectedFile);
        }
      };
    
      const parseCSV = (file : File) => {
        Papa.parse(file, {
          complete: (result) => {
            console.log('Parsed CSV result:', result);
            setData(result.data);
            setHeaders(result.meta.fields);
          },
          header: true,
          skipEmptyLines: true,
          error: (err) => {
            setError(err.message);
            console.error('Error parsing CSV:', err);
          }
        });
      };

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csvFile">Selecciona un archivo</Label>
            <Input id="csvFile" type="file" onChange={handleFileChange}/>
        </div>
    )
}