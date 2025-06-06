import { UserClassifications } from "@/api/classifications";
import { TableWithDelete } from "@/components/common/TableWithDelete";
import { Classification } from "@/types/ClassificationModel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export function UserClassificationsPage(){
    const displayHeaders :Record<string,string> = 
    {
        dataset: "Dataset",
        update_date: "Fecha",
        status: "Estado",
        model_name: "Modelo",
    }
    const {username} = useParams();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
    
    const [isLoading, setLoading] = useState(true);
    const [reloadClassifications, setReloadClassifications] = useState([]);
    const [classifications, setClassifications] = useState<Classification[]>([])

    useEffect(() => {
        UserClassifications(username ?? "").then( 
            (data) => {
                setClassifications(data.data);
                setLoading(false)
            }
        )
    }, [reloadClassifications])

    const OnDoubleClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        console.log("double click");
    }

    const OnDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log("delete");
    }
    
    return (
        <div>
            <h1>Clasificaciones de {username}</h1>
            {isLoading
                ? <p>Loading...</p>
                : <TableWithDelete 
                    headers={displayHeaders} 
                    data={classifications}
                    onDoubleClick={OnDoubleClick}
                    onDeleteClick={OnDeleteClick}
                    />
            }
        </div>
    )
}