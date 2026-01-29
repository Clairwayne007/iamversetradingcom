import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Discover } from "@/components/landing/Discover";
import { InvestmentPlans } from "@/components/landing/InvestmentPlans";
import { Information } from "@/components/landing/Information";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Discover />
        <InvestmentPlans />
        <Information />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
