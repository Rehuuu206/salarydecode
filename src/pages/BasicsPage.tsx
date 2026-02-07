import { motion } from "framer-motion";
import { BookOpen, Shield, Banknote, Building2, HelpCircle, Calculator } from "lucide-react";

const topics = [
  {
    icon: Banknote,
    title: "What is CTC?",
    content: `**CTC (Cost to Company)** is the total amount your company spends on you in a year. It includes:
    
- Your monthly salary (basic + allowances)
- Employer's PF contribution
- Gratuity (if applicable)
- Insurance premiums paid by company

**CTC ≠ In-Hand Salary.** You'll always receive less than your CTC because some parts (like employer PF) are not paid to you directly.

**Example:** If your CTC is ₹6,00,000/year, your in-hand might be around ₹40,000-₹45,000/month depending on deductions.`,
  },
  {
    icon: Building2,
    title: "What is PF (Provident Fund)?",
    content: `**PF (Provident Fund)** is a retirement savings scheme mandated by the government.

**How it works:**
- **12% of your Basic Salary** is deducted from your salary (Employee PF)
- Your employer **matches** this with another 12% (Employer PF)
- This goes into your EPF account managed by EPFO

**Important:**
- PF is deducted from your salary, reducing your in-hand
- Employer PF is part of your CTC but NOT your in-hand salary
- You can withdraw PF when switching jobs or after retirement
- PF earns interest (~8.1% per year, tax-free)

**If Basic = ₹15,000/month → PF = ₹1,800/month (employee) + ₹1,800/month (employer)**`,
  },
  {
    icon: Shield,
    title: "What is Professional Tax?",
    content: `**Professional Tax** is a state-level tax charged on your income from profession or employment.

**Key facts:**
- Maximum limit is **₹2,500 per year** (varies by state)
- Not all states charge it (no PT in Delhi, Haryana, UP, etc.)
- States like Maharashtra, Karnataka, West Bengal charge it
- It's **deducted monthly** by your employer
- It's **tax-deductible** under Income Tax

**Example:** In Karnataka, if you earn above ₹15,000/month, you pay ₹200/month as Professional Tax.`,
  },
  {
    icon: Calculator,
    title: "What is TDS (Income Tax)?",
    content: `**TDS (Tax Deducted at Source)** is the income tax your employer deducts from your salary every month.

**How it's calculated:**
- Based on your **annual income** and the **tax regime** you choose
- Your employer estimates your yearly tax and divides it by 12

**New Tax Regime (FY 2024-25):**
| Income Slab | Tax Rate |
|---|---|
| Up to ₹3,00,000 | Nil |
| ₹3-7 lakh | 5% |
| ₹7-10 lakh | 10% |
| ₹10-12 lakh | 15% |
| ₹12-15 lakh | 20% |
| Above ₹15 lakh | 30% |

**Tip:** You can submit investment proofs (80C, HRA, etc.) to reduce TDS under the old regime.`,
  },
  {
    icon: HelpCircle,
    title: "CTC vs In-Hand: What's the Difference?",
    content: `This is the #1 confusion for freshers! Here's a simple breakdown:

**CTC (What company pays):**
Your full package including everything — salary, PF, insurance, perks.

**Gross Salary:**
CTC minus employer-only contributions (like employer PF). This is your salary before deductions.

**In-Hand Salary (Net Salary):**
Gross salary minus all deductions — PF, tax, professional tax. This is what hits your bank account!

**Simple Formula:**
\`\`\`
In-Hand = Gross Salary - (Employee PF + Professional Tax + Income Tax)
CTC = Gross Salary + Employer PF + Other Benefits
\`\`\`

**Example for ₹5 LPA CTC:**
- CTC: ₹5,00,000/year
- Employer PF: ~₹21,600/year  
- Gross: ~₹4,78,400/year
- Deductions: ~₹60,000/year
- In-Hand: ~₹34,900/month`,
  },
  {
    icon: Banknote,
    title: "What is HRA?",
    content: `**HRA (House Rent Allowance)** is a salary component to help you pay rent.

**Key points:**
- Usually **40-50% of Basic Salary** (50% in metro cities)
- If you pay rent, you can claim **HRA exemption** to save tax
- If you don't pay rent, full HRA is taxable

**HRA Tax Exemption (lowest of these 3):**
1. Actual HRA received
2. Rent paid minus 10% of Basic
3. 50% of Basic (metro) or 40% of Basic (non-metro)

**Example:** Basic ₹25,000, HRA ₹10,000, Rent paid ₹12,000 (Bangalore)
- Actual HRA: ₹10,000
- Rent - 10% Basic: ₹12,000 - ₹2,500 = ₹9,500
- 50% of Basic: ₹12,500
- **Exempt HRA = ₹9,500** (lowest)`,
  },
];

export default function BasicsPage() {
  return (
    <div className="min-h-screen bg-gradient-hero pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Beginner-Friendly Guide
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            PF & Tax <span className="text-gradient">Basics</span>
          </h1>
          <p className="text-muted-foreground">
            Everything you need to know about your salary, explained simply
          </p>
        </motion.div>

        <div className="space-y-6">
          {topics.map((topic, index) => (
            <motion.details
              key={topic.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-gradient-card rounded-xl border border-border/50 overflow-hidden"
            >
              <summary className="flex items-center gap-3 p-5 cursor-pointer list-none hover:bg-secondary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <topic.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold flex-1">{topic.title}</h3>
                <span className="text-muted-foreground text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 pt-0">
                <div className="prose prose-sm prose-invert max-w-none pl-[52px]">
                  {topic.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-semibold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('- ')) {
                      return <p key={i} className="text-muted-foreground ml-2">{line}</p>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="text-muted-foreground">{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
              </div>
            </motion.details>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground/60 mt-8"
        >
          ⚠️ Tax rules may change. Information is based on FY 2024-25 guidelines. 
          Always verify with official sources or a CA.
        </motion.p>
      </div>
    </div>
  );
}
