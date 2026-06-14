import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bug, CheckCircle, Clock, LogOut, Mail, Trash2 } from "lucide-react";
import { sendApprovalEmail } from "@/lib/api/email";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin-hidden-portal")({
  component: AdminPage,
});

interface BugReport {
  id: string;
  title: string;
  description: string;
  email: string | null;
  status: string;
  created_at: string;
}

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simple local storage session for demo purposes,
  // in a real app use Supabase Auth
  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (session === "true") {
      setIsLoggedIn(true);
      fetchBugs();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "nhutcoderteam0902pr" && password === "090211") {
      setIsLoggedIn(true);
      localStorage.setItem("admin_session", "true");
      toast.success("Đăng nhập thành công");
      fetchBugs();
    } else {
      toast.error("Sai tài khoản hoặc mật khẩu");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_session");
    toast.info("Đã đăng xuất");
  };

  const fetchBugs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bugs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBugs(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error("Lỗi khi tải danh sách bug: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (bug: BugReport) => {
    try {
      const { error } = await supabase.from("bugs").update({ status: "approved" }).eq("id", bug.id);

      if (error) throw error;

      toast.success("Đã xét duyệt bug");

      // Send approval email
      if (bug.email) {
        sendApprovalEmail({
          data: {
            email: bug.email,
            title: bug.title,
          },
        }).catch((err) => console.error("Failed to send approval email:", err));
      }

      fetchBugs();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error("Lỗi: " + errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) return;
    try {
      const { error } = await supabase.from("bugs").delete().eq("id", id);
      if (error) throw error;
      toast.success("Đã xóa báo cáo");
      fetchBugs();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error("Lỗi: " + errorMessage);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Bug className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>Vui lòng đăng nhập để quản lý báo cáo lỗi</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <Button type="submit" className="w-full" variant="launch">
                Đăng nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold">BUG MANAGER</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={fetchBugs}>
              Làm mới
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Danh sách báo cáo lỗi</h1>
          <Badge variant="secondary" className="px-3 py-1">
            {bugs.length} báo cáo
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : bugs.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30">
            <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Chưa có báo cáo lỗi nào.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bugs.map((bug) => (
              <Card
                key={bug.id}
                className="border-border bg-card/50 transition-all hover:border-primary/30"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{bug.title}</CardTitle>
                      {bug.status === "approved" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          Đã xét duyệt
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500/20">
                          Chờ xử lý
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {new Date(bug.created_at).toLocaleString("vi-VN")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {bug.status !== "approved" && (
                      <Button
                        size="sm"
                        variant="launch"
                        className="h-8"
                        onClick={() => handleApprove(bug)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Xét duyệt
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(bug.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{bug.description}</p>
                  </div>
                  {bug.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3 text-primary" />
                      Người gửi: <span className="font-mono text-foreground">{bug.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
