import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useNavigate } from "react-router-dom";
import { UserIcon } from "lucide-react";
 
export default function Layout({ children }: { children: React.ReactNode }) {
    const username = window.localStorage.getItem("username");
    const navigate = useNavigate();
    if(!username){
        navigate("/login")
    }
    return (
        <div className="flex flex-col h-screen">
            <header className="w-full bg-blue-600 p-2 fixed flex justify-end items-center z-50">
                <a href={'/account'} className="text-primary-foreground hover:text-primary flex items-center gap-2"><UserIcon/>{username}</a>
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