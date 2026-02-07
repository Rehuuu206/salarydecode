// Rule-based salary calculation engine for Indian payslip

export interface PayslipInput {
  month: string;
  basic: number;
  hra: number;
  specialAllowance: number;
  otherAllowance: number;
  employeePF: number;
  employerPF: number;
  professionalTax: number;
  incomeTax: number;
}

export interface PayslipResult {
  grossSalary: number;
  totalDeductions: number;
  inHandSalary: number;
  ctc: number;
  warnings: string[];
  breakdown: {
    label: string;
    amount: number;
    type: 'earning' | 'deduction' | 'employer';
    percentage: number;
  }[];
}

/**
 * Calculate salary components from payslip input.
 * All calculations are rule-based — NO AI involved.
 */
export function calculateSalary(input: PayslipInput): PayslipResult {
  const warnings: string[] = [];

  // Gross Salary = Basic + HRA + Special Allowance + Other Allowances
  const grossSalary = input.basic + input.hra + input.specialAllowance + input.otherAllowance;

  // Total Deductions = Employee PF + Professional Tax + Income Tax
  const totalDeductions = input.employeePF + input.professionalTax + input.incomeTax;

  // In-Hand Salary = Gross Salary - Total Deductions
  // Note: Employer PF is NOT deducted from in-hand
  const inHandSalary = grossSalary - totalDeductions;

  // CTC = Gross Salary + Employer PF (+ any other employer contributions)
  const ctc = grossSalary + input.employerPF;

  // Validate PF calculation (usually 12% of basic)
  const expectedPF = Math.round(input.basic * 0.12);
  const pfDifference = Math.abs(input.employeePF - expectedPF);
  
  if (input.basic > 0 && pfDifference > 100) {
    warnings.push(
      `Your Employee PF (₹${input.employeePF.toLocaleString('en-IN')}) differs from the standard 12% of basic salary (₹${expectedPF.toLocaleString('en-IN')}). This could be due to a different PF rate or a cap on PF-eligible salary.`
    );
  }

  // Check employer PF vs employee PF
  if (input.employeePF > 0 && input.employerPF > 0) {
    const pfRatio = input.employerPF / input.employeePF;
    if (pfRatio < 0.8 || pfRatio > 1.2) {
      warnings.push(
        `Employer PF (₹${input.employerPF.toLocaleString('en-IN')}) and Employee PF (₹${input.employeePF.toLocaleString('en-IN')}) don't match closely. Usually both are equal.`
      );
    }
  }

  // Check professional tax limit (max ₹2500/month in most states)
  if (input.professionalTax > 2500) {
    warnings.push(
      `Professional Tax (₹${input.professionalTax.toLocaleString('en-IN')}) seems higher than the usual maximum of ₹2,500/month. Please verify.`
    );
  }

  // Check HRA ratio to basic (usually 40-50% of basic)
  if (input.basic > 0 && input.hra > 0) {
    const hraPercent = (input.hra / input.basic) * 100;
    if (hraPercent > 60) {
      warnings.push(
        `HRA is ${hraPercent.toFixed(0)}% of your basic salary, which is higher than the usual 40-50%. This may affect HRA tax exemption.`
      );
    }
  }

  // Build breakdown for visualization
  const breakdown = [
    { label: 'Basic Salary', amount: input.basic, type: 'earning' as const, percentage: ctc > 0 ? (input.basic / ctc) * 100 : 0 },
    { label: 'HRA', amount: input.hra, type: 'earning' as const, percentage: ctc > 0 ? (input.hra / ctc) * 100 : 0 },
    { label: 'Special Allowance', amount: input.specialAllowance, type: 'earning' as const, percentage: ctc > 0 ? (input.specialAllowance / ctc) * 100 : 0 },
    { label: 'Other Allowances', amount: input.otherAllowance, type: 'earning' as const, percentage: ctc > 0 ? (input.otherAllowance / ctc) * 100 : 0 },
    { label: 'Employee PF', amount: input.employeePF, type: 'deduction' as const, percentage: ctc > 0 ? (input.employeePF / ctc) * 100 : 0 },
    { label: 'Professional Tax', amount: input.professionalTax, type: 'deduction' as const, percentage: ctc > 0 ? (input.professionalTax / ctc) * 100 : 0 },
    { label: 'Income Tax', amount: input.incomeTax, type: 'deduction' as const, percentage: ctc > 0 ? (input.incomeTax / ctc) * 100 : 0 },
    { label: 'Employer PF', amount: input.employerPF, type: 'employer' as const, percentage: ctc > 0 ? (input.employerPF / ctc) * 100 : 0 },
  ].filter(item => item.amount > 0);

  return {
    grossSalary,
    totalDeductions,
    inHandSalary,
    ctc,
    warnings,
    breakdown,
  };
}

/**
 * Format currency in Indian format
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Convert monthly to annual and vice versa
 */
export function convertPeriod(amount: number, from: 'monthly' | 'annual'): number {
  return from === 'monthly' ? amount * 12 : Math.round(amount / 12);
}
