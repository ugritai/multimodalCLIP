import { ChangePassword } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function AccountPage(){
    const username = window.localStorage.getItem("username");
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        ChangePassword(currentPassword, newPassword)
            .then(() => alert("Contraseña cambiada"))
            .catch(() => alert("Contraseña incorrecta"));
    };

    return (
        <div>
            <header><h1>Usuario: {username}</h1></header>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
                <h1>Cambiar contraseña</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6 w-1/3">
                    <div className="grid gap-2">
                        <Label htmlFor="currentPassword">Contraseña actual</Label>
                        <Input
                        className="bg-white-100"
                        id="currentPassword"
                        type="password"
                        required value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                        <Label htmlFor="newPassword">Contraseña</Label>
                        </div>
                        <Input 
                            className="bg-white-100"
                            id="newPassword" 
                            type="password" 
                            required value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Cambiar Contraseña
                    </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}