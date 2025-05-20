import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useNavigate } from "react-router-dom";
 
export default function Layout({ children }: { children: React.ReactNode }) {
    const username = window.localStorage.getItem("username");
    const navigate = useNavigate();
    if(!username){
        navigate("/login")
    }
    return (
        <div className="flex flex-col h-screen">
            <header className="w-full bg-blue-600 p-2 fixed">
                {username}
            </header>
            <div className="flex flex-1">
                <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1 pl-2 pt-10 overflow-x-auto">
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
            </div>
        </div>
    )
}