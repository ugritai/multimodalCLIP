import { BookUser, FlaskConical, LogOut, Combine, Settings } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom";
 

 
export function AppSidebar() {
  // Menu items.
  const {pathname} = useLocation();
  console.log(pathname);
  const username = window.localStorage.getItem("username");
  const items = [
    {
      title: "Datasets",
      url: `/datasets/${username}`,
      icon: BookUser,
      active :pathname.startsWith('/dataset'),
    },
    {
      title: "Modelos",
      url: `/models/${username}`,
      icon: FlaskConical,
      active :pathname.startsWith('/model'),
    },
    {
      title: "Clasificaciones",
      url: `/classifications/${username}`,
      icon: Combine,
      active :pathname.startsWith('/classification'),
    },
    {
      title: "Cuenta",
      url: "/account",
      icon: Settings,
      active :pathname.startsWith('/account'),
    }
  ]
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="md:mt-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className={item.active ? "bg-sidebar-accent": ""}>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/logout">
                <LogOut/>
                <span>Cerrar sesión</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}