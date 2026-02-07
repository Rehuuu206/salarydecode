import { Calculator, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/30 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold">SalaryDecoder</span>
            <span>— Educational tool for Indian employees</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> for freshers & working professionals
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          ⚠️ Disclaimer: This tool is for educational purposes only. Not legal, tax, or financial advice.
          Always consult a qualified CA/tax professional for official decisions.
        </p>
      </div>
    </footer>
  );
}
