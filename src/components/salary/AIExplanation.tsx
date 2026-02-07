import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";
import { PayslipInput, PayslipResult, formatINR } from "@/lib/calculations";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface AIExplanationProps {
  input: PayslipInput;
  result: PayslipResult;
}

export default function AIExplanation({ input, result }: AIExplanationProps) {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const payslipSummary = `
Month: ${input.month}
Basic Salary: ${formatINR(input.basic)}
HRA: ${formatINR(input.hra)}
Special Allowance: ${formatINR(input.specialAllowance)}
Other Allowances: ${formatINR(input.otherAllowance)}
Employee PF: ${formatINR(input.employeePF)}
Employer PF: ${formatINR(input.employerPF)}
Professional Tax: ${formatINR(input.professionalTax)}
Income Tax (TDS): ${formatINR(input.incomeTax)}
---
Gross Salary: ${formatINR(result.grossSalary)}
Total Deductions: ${formatINR(result.totalDeductions)}
In-Hand Salary: ${formatINR(result.inHandSalary)}
CTC: ${formatINR(result.ctc)}
${result.warnings.length > 0 ? `\nWarnings: ${result.warnings.join("; ")}` : ""}
        `.trim();

        const resp = await supabase.functions.invoke("explain-salary", {
          body: { payslipData: payslipSummary },
        });

        if (resp.error) throw new Error(resp.error.message || "Failed to get AI explanation");

        // Handle streaming response
        if (resp.data && typeof resp.data === "string") {
          setExplanation(resp.data);
        } else if (resp.data?.explanation) {
          setExplanation(resp.data.explanation);
        } else {
          setExplanation("Could not generate explanation. Please try again.");
        }
      } catch (err: any) {
        console.error("AI explanation error:", err);
        setError(err.message || "Failed to get explanation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanation();
  }, [input, result]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-xl border border-primary/20 p-6"
    >
      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        AI Explanation
      </h3>

      {isLoading ? (
        <div className="flex items-center gap-3 text-muted-foreground py-8 justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Analyzing your payslip...</span>
        </div>
      ) : error ? (
        <div className="text-destructive text-sm py-4">
          {error}
        </div>
      ) : (
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>
      )}

      <p className="text-xs text-muted-foreground/60 mt-4 pt-4 border-t border-border/30">
        ⚠️ AI-generated explanation for educational purposes only. Not financial or legal advice.
      </p>
    </motion.div>
  );
}
