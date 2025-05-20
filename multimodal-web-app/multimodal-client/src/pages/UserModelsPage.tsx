import LeftDownAddButton from "@/components/common/AddButtonModal";
import { useParams } from "react-router-dom";

export function UserModelsPage(){
    const {username} = useParams();
    const loggedUser = window.localStorage.getItem("username");
    const isOwner = (username == loggedUser);
    const handleAddClick = () => {
        console.log("click")
    };
    return (
        <div>
            {isOwner && <LeftDownAddButton onClick={handleAddClick}/>}
        </div>
    )
}