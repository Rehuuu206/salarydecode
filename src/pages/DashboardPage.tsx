import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Trash2, Eye, Lock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

interface SavedPayslip {
  id: string;
  month: string;
  basic: number;
  gross_salary: number;
  in_hand_salary: number;
  ctc: number;
  created_at: string;
}

export default function DashboardPage() {
  const [payslips, setPayslips] = useState<SavedPayslip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      const { data, error } = await supabase
        .from("payslips")
        .select("id, month, basic, gross_salary, in_hand_salary, ctc, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayslips(data || []);
    } catch (err: any) {
      console.error("Error fetching payslips:", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePayslip = async (id: string) => {
    try {
      const { error } = await supabase.from("payslips").delete().eq("id", id);
      if (error) throw error;
      setPayslips(prev => prev.filter(p => p.id !== id));
      toast({ title: "Payslip deleted" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">
              My <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-sm">Your saved payslips and salary history</p>
          </div>
          <Link to="/calculator">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Payslip
            </Button>
          </Link>
        </motion.div>

        {/* Premium Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-card rounded-xl border border-accent/30 p-5 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-sm">Premium Features — Coming Soon</h3>
              <p className="text-xs text-muted-foreground">
                Tax saving suggestions, annual reports, multi-year tracking, and more.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-accent/30 text-accent">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Button>
          </div>
        </motion.div>

        {/* Payslips List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : payslips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">No payslips saved yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Start by decoding your first salary slip
            </p>
            <Link to="/calculator">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calculator className="w-4 h-4 mr-2" />
                Decode My Salary
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {payslips.map((payslip, i) => (
              <motion.div
                key={payslip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-card rounded-xl border border-border/50 p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold">{payslip.month}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                    <span>In-Hand: {formatINR(payslip.in_hand_salary)}</span>
                    <span>CTC: {formatINR(payslip.ctc)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePayslip(payslip.id)}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
