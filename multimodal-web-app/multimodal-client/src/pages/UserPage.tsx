import { DatasetContainer } from "@/components/userPage/dataset-container";
import { useParams } from "react-router-dom";

export function UserPage(){
    const {username} = useParams();
    if(username){
        return (
            <div>
                <DatasetContainer username={username}/>
            </div>
        )
    }
    else{
        return (
            <div>Error</div>
        )
    }
}