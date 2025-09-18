import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  HelpCircle, 
  Award, 
  Phone, 
  Users, 
  Stethoscope,
  Info
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "How It Works", url: "/how-it-works", icon: HelpCircle },
  { title: "Benefits", url: "/benefits", icon: Award },
  { title: "Contact & Help", url: "/contact", icon: Phone },
];

const authItems = [
  { title: "Patient Login", url: "/patient-login", icon: Users },
  { title: "Doctor Login", url: "/doctor-login", icon: Stethoscope },
];

const infoItems = [
  { title: "About Us", url: "/about", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/70";

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="bg-card border-r border-border">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5 text-current" />
                      {!isCollapsed && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Authentication Links */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold">
            {!isCollapsed && "Access"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {authItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-5 h-5 text-current" />
                      {!isCollapsed && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Information Links */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold">
            {!isCollapsed && "Information"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-5 h-5 text-current" />
                      {!isCollapsed && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}