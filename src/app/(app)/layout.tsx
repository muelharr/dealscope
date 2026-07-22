import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      {/* Left Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col lg:pl-64 min-h-screen pb-14 lg:pb-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-spacing-4 lg:p-spacing-8">
          <div className="mx-auto max-w-container">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileNav />
    </div>
  );
}
