import { BookUser, FlaskConical, Inbox, Combine, Settings } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
 

 
export function AppSidebar() {
  // Menu items.
  
  const username = window.localStorage.getItem("username");
  const items = [
    {
      title: "Datasets",
      url: `/datasets/${username}`,
      icon: BookUser,
    },
    {
      title: "Modelos",
      url: `/models/${username}`,
      icon: FlaskConical,
    },
    {
      title: "Clasificaciones",
      url: `/classifications/${username}`,
      icon: Combine,
    },
    {
      title: "Cuenta",
      url: "/account",
      icon: Settings
    }
  ]
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="top-10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}