import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ComboBox } from "./ComboBox"
import { Button } from "@/components/ui/button"
import { HeaderFormField } from "./HeaderFormField"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

class WebSocketClient {
    public socket: WebSocket | null = null;
  
    constructor(url: string) {
      this.socket = new WebSocket(url);
  
      // Manejar la apertura de la conexión
      this.socket.onopen = this.onOpen;
      
      // Manejar errores
      this.socket.onerror = this.onError;
      
      // Manejar el cierre de la conexión
      this.socket.onclose = this.onClose;
    }
  
    // Función que maneja la apertura de la conexión WebSocket
    private onOpen = (event: Event): void => {
      console.log('Conexión WebSocket abierta:', event);
    };
  
    // Función que maneja los errores
    private onError = (event: Event): void => {
      console.error('Error en WebSocket:', event);
    };
  
    // Función que maneja el cierre de la conexión WebSocket
    private onClose = (event: CloseEvent): void => {
      console.log('Conexión WebSocket cerrada:', event);
    };
  
    // Método para enviar un mensaje al servidor
    public sendMessage(message: string): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
        console.log('Mensaje enviado:', message);
      } else {
        console.error('WebSocket no está abierto');
      }
    }
  
    // Cerrar la conexión WebSocket
    public closeConnection(): void {
      if (this.socket) {
        this.socket.close();
        console.log('Conexión WebSocket cerrada');
      }
    }
  }

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
})

export function WebSocketComponent(){
    const [message, setMessage] = useState<string>('');
    const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
    const [headers, setHeaders] = useState<string[] | null>(null);
    
    // Función que maneja los mensajes recibidos del servidor
    const onMessage = (event: MessageEvent): void => {
      console.log('Mensaje recibido del servidor:', event.data);
      let receivedData = JSON.parse(event.data)
      switch(receivedData.type){
        case "ReturnHeaders":
          setHeaders(receivedData.headers)
          break;
      }
    };
  
    useEffect(() => {
      const client = new WebSocketClient('ws://localhost:8000/ws/visualize/prueba');
      client.socket.onmessage=onMessage;
      setWsClient(client);
  
      // Limpieza al desmontar el componente
      return () => {
        client.closeConnection();
      };
    }, []);


    const convertFileToBase64 =(file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        // Evento cuando la lectura ha terminado
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
    
        // Si ocurre un error durante la lectura del archivo
        reader.onerror = (error) => reject(error);
    
        // Leer el archivo como un Data URL (Base64)
        reader.readAsDataURL(file);
      });
    }

    const sendFile = (file: File) => {
      convertFileToBase64(file)
        .then((str) => 
          {
            if (wsClient) {
            wsClient.sendMessage(`{"type":"UploadFile", "data":"${str.split('base64,')[1]}"}`);
            }
          })
        .catch((error) => console.error(error))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files ? event.target.files[0] : null;
      if (selectedFile) {
        sendFile(selectedFile);
      }
    };
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
      console.log('hola')
      console.log(data)
    }
  
    return (
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="csvFile">Selecciona un archivo</Label>
          <Input id="csvFile" type="file" onChange={handleFileChange}/>
        </div>
        {headers && (
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <HeaderFormField form={form} values={headers} fieldName='Classes'/>
                <HeaderFormField form={form} values={headers} fieldName='Text'/>
                <HeaderFormField form={form} values={headers} fieldName='Images'/>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
          // <div id="headersComboBoxes">
          //   <ComboBox values={headers} defaultText="Classes"/>
          //   <ComboBox values={headers} defaultText="Text Field"/>
          //   <ComboBox values={headers} defaultText="Image Field"/>
          // </div>
          
          )
        }
      </div>
    );
  };