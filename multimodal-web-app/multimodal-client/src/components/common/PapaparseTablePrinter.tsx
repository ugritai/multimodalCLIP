import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export function PapaparseTablePrinter({headers, data, nElements} : {headers : any, data : any, nElements : number})
    {
    
    return (
        <Table >
            <TableHeader>
                <TableRow key='header'>
                    {headers.map((header : any, col : any) => (
                        <TableHead key={col}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.slice(0, nElements).map((row: any, index : any) => (
                    <TableRow key={index}>
                        {headers.map((header : any, col : any) => (
                            <TableCell key={col}>{row[header]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}