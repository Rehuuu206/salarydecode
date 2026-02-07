import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, TrendingUp, TrendingDown, Wallet, Building2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayslipResult, PayslipInput, formatINR } from "@/lib/calculations";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import AIExplanation from "@/components/salary/AIExplanation";

interface SalaryResultsProps {
  result: PayslipResult;
  input: PayslipInput;
  onReset: () => void;
}

const COLORS = {
  earning: "hsl(160, 84%, 39%)",
  deduction: "hsl(0, 84%, 60%)",
  employer: "hsl(38, 92%, 50%)",
};

export default function SalaryResults({ result, input, onReset }: SalaryResultsProps) {
  const [showAI, setShowAI] = useState(false);

  const pieData = result.breakdown.map((item) => ({
    name: item.label,
    value: item.amount,
    color: COLORS[item.type],
  }));

  const summaryCards = [
    { label: "Gross Salary", value: result.grossSalary, icon: TrendingUp, color: "text-primary" },
    { label: "Total Deductions", value: result.totalDeductions, icon: TrendingDown, color: "text-destructive" },
    { label: "In-Hand Salary", value: result.inHandSalary, icon: Wallet, color: "text-accent" },
    { label: "CTC (with Employer PF)", value: result.ctc, icon: Building2, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-card rounded-xl border border-border/50 p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="font-display text-xl md:text-2xl font-bold">{formatINR(card.value)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatINR(card.value * 12)} / year</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-card rounded-xl border border-border/50 p-6"
        >
          <h3 className="font-display text-lg font-semibold mb-4">CTC Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatINR(value)}
                  contentStyle={{
                    backgroundColor: "hsl(222, 40%, 10%)",
                    border: "1px solid hsl(220, 25%, 18%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 93%)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-card rounded-xl border border-border/50 p-6"
        >
          <h3 className="font-display text-lg font-semibold mb-4">Detailed Breakdown</h3>
          <div className="space-y-3">
            {result.breakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[item.type] }}
                  />
                  <div>
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${item.type === 'deduction' ? 'text-destructive' : ''}`}>
                  {item.type === 'deduction' ? '−' : ''}{formatINR(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-5"
        >
          <h3 className="font-display text-sm font-semibold text-accent flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" />
            Things to Note
          </h3>
          <ul className="space-y-2">
            {result.warnings.map((warning, i) => (
              <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* AI Explanation */}
      {showAI ? (
        <AIExplanation input={input} result={result} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => setShowAI(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8"
          >
            <Brain className="w-4 h-4 mr-2" />
            Explain My Salary with AI
          </Button>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onReset} className="border-border text-foreground hover:bg-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Enter New Payslip
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground/60 max-w-xl mx-auto">
        ⚠️ This is an educational estimate only. Actual salary may vary based on company policies, 
        state-specific taxes, and other factors. Consult your HR or a qualified CA for exact details.
      </p>
    </div>
  );
}
