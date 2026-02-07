import { useState } from "react";
import { motion } from "framer-motion";
import PayslipForm from "@/components/salary/PayslipForm";
import SalaryResults from "@/components/salary/SalaryResults";
import { PayslipInput, PayslipResult, calculateSalary } from "@/lib/calculations";

export default function CalculatorPage() {
  const [result, setResult] = useState<PayslipResult | null>(null);
  const [input, setInput] = useState<PayslipInput | null>(null);

  const handleCalculate = (data: PayslipInput) => {
    setInput(data);
    const calculated = calculateSalary(data);
    setResult(calculated);
  };

  const handleReset = () => {
    setResult(null);
    setInput(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Salary <span className="text-gradient">Calculator</span>
          </h1>
          <p className="text-muted-foreground">
            Enter your payslip details to decode your salary breakdown
          </p>
        </motion.div>

        {!result ? (
          <PayslipForm onCalculate={handleCalculate} />
        ) : (
          <SalaryResults result={result} input={input!} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
