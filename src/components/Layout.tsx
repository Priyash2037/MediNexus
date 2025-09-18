import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Heart } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-2" />
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  MediNexus
                </h1>
              </div>
              <LanguageSwitcher />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}