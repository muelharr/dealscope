import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import { AppNavigationProvider } from "@/components/layout/AppNavigationProvider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppNavigationProvider>
      <div className="min-h-screen bg-paper flex flex-col overflow-x-clip">
        {/* Desktop sidebar; turns into a controlled drawer below lg. */}
        <Sidebar />

        <div className="flex flex-col flex-grow lg:pl-64">
          <Navbar />

          <main className="flex-1 px-4 py-4 pb-20 sm:px-6 sm:py-6 sm:pb-20 lg:p-6">
            <div className="mx-auto w-full max-w-[1280px]">
              {children}
            </div>
          </main>

          <Footer variant="app" />
        </div>

        <MobileNav />
      </div>
    </AppNavigationProvider>
  );
}
