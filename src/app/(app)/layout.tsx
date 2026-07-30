import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Left Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col lg:pl-64 flex-grow">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-[1280px]">
            {children}
          </div>
        </main>

        {/* App-wide Footer */}
        <Footer variant="full" />
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileNav />
    </div>
  );
}
