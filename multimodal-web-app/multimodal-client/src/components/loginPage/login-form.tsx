import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import {Login} from "@/api/auth.api";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
      // Estados para el usuario, contraseña y error
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    Login(username, password)
      .then((data) => {
        window.localStorage.setItem("username", username);
        window.localStorage.setItem("token", data.data.auth_token);
        setError("") 
        navigate(`/datasets/${username}`)
      })
      .catch((error) => {
        console.log(error);
        setError("Credenciales incorrectas") 
      });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Autenticacion</CardTitle>
          <CardDescription>
            Introduzca su usuario para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="usuario"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    required value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}