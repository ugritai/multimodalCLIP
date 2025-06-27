import { ClassificationsTable } from "@/components/userClassificationsPage/ClassificationsTable";
import { useParams } from "react-router-dom";


export function UserClassificationsPage(){
    const {username} = useParams();
   
    return (
        <div>
            <h1 className="text-2xl font-semibold">Clasificaciones de {username}</h1>
            <ClassificationsTable username={username ?? ""}/>
        </div>
    )
}