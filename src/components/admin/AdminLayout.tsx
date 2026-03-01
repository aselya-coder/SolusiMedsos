import { useEffect, useState } from "react";
import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Globe, Image, Info, Briefcase, ListOrdered, DollarSign, MessageSquare, HelpCircle, Send, Phone, LogOut, Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return <Navigate to="/admin/login" />;

  // Only allow admin email
  const isAdmin = session.user.email === "admin@solusimedsos.id";
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">Akses Ditolak</h1>
        <p className="text-muted-foreground">Hanya akun administrator yang dapat mengakses halaman ini.</p>
        <Button onClick={handleLogout}>Keluar</Button>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Navbar", href: "/admin/navbar", icon: Globe },
    { label: "Hero", href: "/admin/hero", icon: Image },
    { label: "About", href: "/admin/about", icon: Info },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "How It Works", href: "/admin/how-it-works", icon: ListOrdered },
    { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { label: "CTA", href: "/admin/cta", icon: Send },
    { label: "Footer", href: "/admin/footer", icon: Globe },
    { label: "WhatsApp", href: "/admin/whatsapp", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 bg-background border-b flex justify-between items-center">
        <span className="font-bold text-primary">SolusiMedsos Admin</span>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 fixed lg:static inset-0 z-40 w-64 bg-background border-r transition-transform duration-200 ease-in-out flex flex-col
      `}>
        <div className="p-6 border-b hidden lg:block">
          <span className="font-bold text-xl text-primary">Admin SolusiMedsos</span>
        </div>
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === item.href 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"}
              `}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut size={18} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow p-4 lg:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
