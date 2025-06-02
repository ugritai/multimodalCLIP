import { useParams } from "react-router-dom";

export function UserClassificationsPage(){
    const {username} = useParams();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
    
    return (
        <div>
            <h1>Clasificaciones de {username}</h1>
        </div>
    )
}