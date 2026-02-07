import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, RotateCcw, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PayslipInput, convertPeriod } from "@/lib/calculations";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const schema = z.object({
  month: z.string().min(1, "Select a month"),
  basic: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
  hra: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
  specialAllowance: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
  otherAllowance: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
  employeePF: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
  employerPF: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
  professionalTax: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
  incomeTax: z.number({ invalid_type_error: "Enter a valid number" }).min(0, "Must be 0 or more"),
});

interface PayslipFormProps {
  onCalculate: (data: PayslipInput) => void;
}

export default function PayslipForm({ onCalculate }: PayslipFormProps) {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PayslipInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      month: "",
      basic: 0,
      hra: 0,
      specialAllowance: 0,
      otherAllowance: 0,
      employeePF: 0,
      employerPF: 0,
      professionalTax: 0,
      incomeTax: 0,
    },
  });

  const onSubmit = (data: PayslipInput) => {
    // Convert to monthly if entered as annual
    if (period === "annual") {
      const monthlyData: PayslipInput = {
        ...data,
        basic: convertPeriod(data.basic, "annual"),
        hra: convertPeriod(data.hra, "annual"),
        specialAllowance: convertPeriod(data.specialAllowance, "annual"),
        otherAllowance: convertPeriod(data.otherAllowance, "annual"),
        employeePF: convertPeriod(data.employeePF, "annual"),
        employerPF: convertPeriod(data.employerPF, "annual"),
        professionalTax: convertPeriod(data.professionalTax, "annual"),
        incomeTax: convertPeriod(data.incomeTax, "annual"),
      };
      onCalculate(monthlyData);
    } else {
      onCalculate(data);
    }
  };

  const fields: { name: keyof PayslipInput; label: string; hint: string; section: "earning" | "deduction" }[] = [
    { name: "basic", label: "Basic Salary", hint: "Base pay before any additions", section: "earning" },
    { name: "hra", label: "HRA (House Rent Allowance)", hint: "Allowance for rent expenses", section: "earning" },
    { name: "specialAllowance", label: "Special Allowance", hint: "Additional fixed allowance", section: "earning" },
    { name: "otherAllowance", label: "Other Allowances", hint: "Any other allowances combined", section: "earning" },
    { name: "employeePF", label: "Employee PF", hint: "Your contribution to provident fund", section: "deduction" },
    { name: "employerPF", label: "Employer PF", hint: "Company's PF contribution (part of CTC)", section: "deduction" },
    { name: "professionalTax", label: "Professional Tax", hint: "State-level tax on profession", section: "deduction" },
    { name: "incomeTax", label: "Income Tax (TDS)", hint: "Tax deducted at source", section: "deduction" },
  ];

  const earnings = fields.filter(f => f.section === "earning");
  const deductions = fields.filter(f => f.section === "deduction");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Period toggle and month selector */}
        <div className="bg-gradient-card rounded-xl border border-border/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <Label className="text-foreground font-medium mb-1.5 block">Month</Label>
              <Select onValueChange={(v) => setValue("month", v)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && <p className="text-destructive text-xs mt-1">{errors.month.message}</p>}
            </div>
            <div>
              <Label className="text-foreground font-medium mb-1.5 block">Input Mode</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPeriod(p => p === "monthly" ? "annual" : "monthly")}
                className="border-border text-foreground hover:bg-secondary"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                {period === "monthly" ? "Monthly" : "Annual"}
              </Button>
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-gradient-card rounded-xl border border-border/50 p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Earnings
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {earnings.map((field) => (
              <div key={field.name}>
                <Label className="text-foreground text-sm font-medium mb-1 block">{field.label}</Label>
                <Input
                  type="number"
                  placeholder="0"
                  className="bg-secondary border-border"
                  {...register(field.name as any, { valueAsNumber: true })}
                />
                <p className="text-muted-foreground text-xs mt-1">{field.hint}</p>
                {errors[field.name] && (
                  <p className="text-destructive text-xs mt-1">{(errors[field.name] as any)?.message}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-gradient-card rounded-xl border border-border/50 p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            Deductions
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {deductions.map((field) => (
              <div key={field.name}>
                <Label className="text-foreground text-sm font-medium mb-1 block">{field.label}</Label>
                <Input
                  type="number"
                  placeholder="0"
                  className="bg-secondary border-border"
                  {...register(field.name as any, { valueAsNumber: true })}
                />
                <p className="text-muted-foreground text-xs mt-1">{field.hint}</p>
                {errors[field.name] && (
                  <p className="text-destructive text-xs mt-1">{(errors[field.name] as any)?.message}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => reset()} className="border-border text-foreground hover:bg-secondary">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Salary
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
