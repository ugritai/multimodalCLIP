import { Logout } from "@/api/auth.api";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
    const navigate = useNavigate();
    useEffect( () => {
        Logout()
        .finally( () => navigate('/login')
        )
    })

    return (
        <div className="flex h-screen w-full items-center justify-center p-6 md:p-10">
        <Card>
            <CardContent>
                <Label htmlFor="logout">Cerrando sesión...</Label>
            </CardContent>
        </Card>
        </div>
    )
}