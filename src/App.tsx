import { PageHeader } from "@/components/Layout/PageHeader";
import { TaxCalculatorPage } from "@/pages/TaxCalculator/TaxCalculatorPage";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <TaxCalculatorPage />
    </div>
  );
}
