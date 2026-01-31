import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-full overflow-hidden">
            <Sidebar className="hidden md:flex" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto bg-muted/20 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
