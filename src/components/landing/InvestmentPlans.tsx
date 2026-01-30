import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export interface InvestmentPlan {
  id: string;
  name: string;
  amount: number;
  roi: number;
  duration: string;
  durationDays: number;
  features: string[];
}

export const investmentPlans: InvestmentPlan[] = [
  {
    id: "plan-108",
    name: "108 Circle",
    amount: 108,
    roi: 10,
    duration: "1 Week 3 Days",
    durationDays: 10,
    features: ["10% ROI Daily", "Secure Investment", "24/7 Support"],
  },
  {
    id: "plan-2222",
    name: "2222 Investment",
    amount: 2222,
    roi: 20,
    duration: "1 Week 3 Days",
    durationDays: 10,
    features: ["20% ROI Daily", "Priority Support", "Advanced Analytics"],
  },
  {
    id: "plan-8888",
    name: "8888 Investment",
    amount: 8888,
    roi: 30,
    duration: "1 Week 3 Days",
    durationDays: 10,
    features: ["30% ROI Daily", "VIP Support", "Premium Features"],
  },
  {
    id: "plan-tier3",
    name: "Tier 3 Investment",
    amount: 25000,
    roi: 40,
    duration: "1 Week 3 Days",
    durationDays: 10,
    features: ["40% ROI Daily", "Dedicated Manager", "Exclusive Access"],
  },
  {
    id: "plan-elite",
    name: "Bitcoin Elite Group",
    amount: 50000,
    roi: 45,
    duration: "1 Week 3 Days",
    durationDays: 10,
    features: ["45% ROI Daily", "Elite VIP Support", "Priority Withdrawals"],
  },
];

export const InvestmentPlans = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Investment Plans</h2>
          <p className="text-muted-foreground mt-2">
            Choose the plan that fits your investment goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {investmentPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PlanCard = ({ plan }: { plan: InvestmentPlan }) => (
  <Card className="relative overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/70" />
    
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-lg">{plan.name}</CardTitle>
      <div className="mt-4 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {plan.roi}% ROI Daily
      </div>
    </CardHeader>

    <CardContent className="pt-4">
      <div className="text-center text-sm text-muted-foreground mb-4">
        Duration: {plan.duration}
      </div>
      
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Link to="/register">
        <Button className="w-full">Invest Now</Button>
      </Link>
    </CardContent>
  </Card>
);
