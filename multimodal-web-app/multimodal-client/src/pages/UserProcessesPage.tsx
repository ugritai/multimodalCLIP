import { useParams } from "react-router-dom";

export function UserProcessesPage(){
    const {username} = useParams();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
    
    return (
        <div>
        </div>
    )
}