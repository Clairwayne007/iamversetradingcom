import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { InvestmentPlans } from "@/components/landing/InvestmentPlans";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <InvestmentPlans />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
