import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-14 md:hidden" /> {/* Spacer for fixed mobile header */}
                <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
