import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Globe, Users, Briefcase, MessageSquare } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    testimonials: 0,
    faq: 0,
    links: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [services, testimonials, faq, links] = await Promise.all([
        supabase.from("services").select("id", { count: "exact" }),
        supabase.from("testimonials").select("id", { count: "exact" }),
        supabase.from("faq").select("id", { count: "exact" }),
        supabase.from("nav_links").select("id", { count: "exact" }),
      ]);

      setStats({
        services: services.count || 0,
        testimonials: testimonials.count || 0,
        faq: faq.count || 0,
        links: links.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  const cards = [
    { title: "Total Layanan", value: stats.services, icon: Briefcase, color: "text-blue-500" },
    { title: "Testimoni", value: stats.testimonials, icon: Users, color: "text-green-500" },
    { title: "FAQ", value: stats.faq, icon: MessageSquare, color: "text-purple-500" },
    { title: "Menu Navigasi", value: stats.links, icon: Globe, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to SolusiMedsos Admin Panel.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Panduan Penggunaan</CardTitle>
          <CardDescription>Cara mengelola konten landing page Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">
            Pilih menu di samping untuk mulai mengedit bagian website. Perubahan yang Anda simpan akan langsung terlihat di landing page secara real-time. 
            Pastikan untuk menekan tombol <strong>Save</strong> setelah melakukan perubahan.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold mb-2">Upload Gambar</h4>
              <p className="text-xs text-muted-foreground">Gunakan fitur upload pada section Hero atau About untuk mengganti gambar latar belakang atau ilustrasi.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold mb-2">Kelola List</h4>
              <p className="text-xs text-muted-foreground">Pada section Services, Pricing, dan FAQ, Anda bisa menambah atau menghapus item sesuai kebutuhan.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
