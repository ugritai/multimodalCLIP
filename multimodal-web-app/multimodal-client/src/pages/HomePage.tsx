import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        const username = window.localStorage.getItem("username");
        if(username){
            navigate(`/datasets/${username}`);
        }
        else{
            navigate('/login');
        }
    })
    return (<div>Loading...</div>);
}