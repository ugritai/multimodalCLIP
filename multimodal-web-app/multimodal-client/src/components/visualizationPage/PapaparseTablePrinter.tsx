import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

export function PapaparseTablePrinter({headers, data, nElements} : {headers : any, data : any, nElements : number})
    {
    
    return (
            <Table >
                <TableHeader>
                    <TableRow key='header'>
                        {headers.map((header : any, _ : any) => (
                            <TableHead>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.slice(0, nElements).map((row: any, index : any) => (
                        <TableRow key={index}>
                            {headers.map((header : any, _ : any) => (
                                <TableCell>{row[header]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
    )
}