import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, BookOpen, MessageCircle, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: any;
}

const navItems = [
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/basics", label: "PF & Tax Basics", icon: BookOpen },
  { to: "/chat", label: "Ask AI", icon: MessageCircle },
];

export default function Header({ user }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:shadow-glow transition-shadow">
            <Calculator className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Salary<span className="text-gradient">Decoder</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={isActive ? "" : "text-muted-foreground hover:text-foreground"}
                >
                  <item.icon className="w-4 h-4 mr-1.5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <LogIn className="w-4 h-4 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-b border-border/30 px-4 pb-4"
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
