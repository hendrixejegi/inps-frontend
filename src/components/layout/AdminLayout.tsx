import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className={cn("fixed inset-y-0 left-0 z-30 hidden w-64 transition-[width] duration-200 lg:block", collapsed && "w-[76px]")}>
        <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((value) => !value)} />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-0 bg-primary p-0 [&>button]:text-white">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className={cn("transition-[padding] duration-200 lg:pl-64", collapsed && "lg:pl-[76px]")}>
        <Header onOpenMenu={() => setMobileOpen(true)} />
        <main id="main-content" className="px-4 py-6 md:px-7 md:py-8">{children}</main>
      </div>
    </div>
  );
}
