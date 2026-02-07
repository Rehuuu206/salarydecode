import { motion } from "framer-motion";
import { ArrowRight, Calculator, Shield, Brain, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Calculator,
    title: "Decode Your Payslip",
    description: "Enter your salary details and instantly see your CTC breakdown, in-hand salary, and all deductions explained simply.",
  },
  {
    icon: Brain,
    title: "AI Explanations",
    description: "Don't understand HRA or PF? Our AI explains every component in plain English — no finance degree needed.",
  },
  {
    icon: BookOpen,
    title: "Learn PF & Tax Basics",
    description: "Simple, beginner-friendly guides on provident fund, professional tax, income tax, and more.",
  },
  {
    icon: Shield,
    title: "100% Private & Safe",
    description: "We never store sensitive data like PAN, Aadhaar, or bank details. Your salary data stays secure.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Free for Indian Employees
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Understand Your
              <br />
              <span className="text-gradient">Salary Slip</span> in
              <br />
              <span className="text-gradient-accent">Simple Words</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              No more confusion about CTC vs in-hand salary, PF deductions, or tax calculations. 
              SalaryDecoder breaks it all down — designed for freshers and non-finance folks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/calculator">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow text-base px-8 h-12">
                  <Calculator className="w-5 h-5 mr-2" />
                  Decode My Salary
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/basics">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-base px-8 h-12">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn the Basics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Understand</span> Your Salary
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built for freshers and working professionals who want clarity on their payslip.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all hover:shadow-glow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl bg-gradient-card border border-primary/20 p-10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5" />
            <div className="relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                Ready to decode your salary?
              </h2>
              <p className="text-muted-foreground mb-6">
                Takes less than 2 minutes. No sign-up required to try.
              </p>
              <Link to="/calculator">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8">
                  Start Now — It's Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
