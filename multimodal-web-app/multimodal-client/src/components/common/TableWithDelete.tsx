import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "../ui/button";
import { ArrowDownUp, Trash } from "lucide-react";
import { useState } from "react";

type Props = {
        headers : Record<string,string>,
        data : any[],
        nElements? : number | undefined,
        isOwner? : boolean,
        onDeleteClick : React.MouseEventHandler<HTMLButtonElement>,
        onDoubleClick : React.MouseEventHandler<HTMLTableRowElement>,
};

export function TableWithDelete ({headers, data, nElements, isOwner, onDeleteClick, onDoubleClick} : Props) {
    const sortingKvp: Record<string, boolean> = Object.keys(headers).reduce((acc, key) => {
        acc[key] = false;
        return acc;
        }, {} as Record<string, boolean>);
    const [sortColumn] = useState<Record<string,boolean>>(sortingKvp);
    const [_, setRender] = useState(false);


    const GetDisplayData = () => {
        return nElements
            ? data.slice(0, nElements)
            : data;
    }
    const SortByColumn = (col :string) => {
        const asc = sortColumn[col];
        if(asc){
            data.sort((a,b) => a[col].localeCompare(b[col]))
        }
        else{
            data.sort((a,b) => b[col].localeCompare(a[col]))
        }
        sortColumn[col] = !sortColumn[col];
        setRender(x => !x);
    }

    return (
        <Table >
            <TableHeader>
                <TableRow key='header'>
                    {Object.entries(headers).map(([key, displayName]) => (
                        <TableHead key={key}>{displayName} 
                        <Button variant="ghost" onClick={() =>SortByColumn(key)}><ArrowDownUp/></Button>
                        </TableHead>
                    ))}
                    {isOwner && <TableHead>Eliminar</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {GetDisplayData().map((row: any, index : any) => (
                    <TableRow key={index} onDoubleClick={onDoubleClick} accessKey={index}>
                        {Object.entries(headers).map(([key, ]) => (
                            <TableCell key={key}>{row[key]}</TableCell>
                        ))}
                        {isOwner && <TableCell><Button onClick={onDeleteClick}><Trash/></Button></TableCell>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}