import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { investmentPlans, InvestmentPlan } from "@/components/landing/InvestmentPlans";
import { Check, Clock, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock active investments - replace with API
const mockActiveInvestments = [
  {
    id: "1",
    planId: "plan-108",
    planName: "108 Circle",
    amount: 108,
    roi: 10,
    startDate: "2024-01-20",
    endDate: "2024-01-30",
    totalEarned: 86.4,
    status: "active",
  },
];

const Investments = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [isInvesting, setIsInvesting] = useState(false);

  const handleInvest = async () => {
    if (!selectedPlan || !user) return;

    if (user.balance < selectedPlan.amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please deposit funds to your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsInvesting(true);
    
    // TODO: Replace with backend API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      updateUser({ balance: user.balance - selectedPlan.amount });
      
      toast({
        title: "Investment Successful!",
        description: `You've invested $${selectedPlan.amount} in ${selectedPlan.name}`,
      });
      
      setSelectedPlan(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process investment",
        variant: "destructive",
      });
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Active investments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Your Active Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockActiveInvestments.length > 0 ? (
              <div className="space-y-4">
                {mockActiveInvestments.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{inv.planName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Started: {inv.startDate}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Invested</p>
                        <p className="font-medium">${inv.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily ROI</p>
                        <p className="font-medium text-primary">{inv.roi}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Earned</p>
                        <p className="font-medium text-success">+${inv.totalEarned}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p className="font-medium">{inv.endDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No active investments. Choose a plan below to start earning!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Available plans */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Investment Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {investmentPlans.map((plan) => (
              <Card key={plan.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    ${plan.amount.toLocaleString()}
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {plan.roi}% ROI Daily
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Duration: {plan.duration}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    Invest Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Investment confirmation dialog */}
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Investment</DialogTitle>
              <DialogDescription>
                Review your investment details before proceeding
              </DialogDescription>
            </DialogHeader>
            
            {selectedPlan && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">${selectedPlan.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Daily ROI</span>
                    <span className="font-medium text-primary">{selectedPlan.roi}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedPlan.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span>Your Balance</span>
                  <span className="font-bold">${user?.balance?.toLocaleString() || 0}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedPlan(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleInvest}
                    disabled={isInvesting || (user?.balance || 0) < selectedPlan.amount}
                  >
                    {isInvesting ? (
                      <TrendingUp className="h-4 w-4 animate-pulse" />
                    ) : (
                      "Confirm Investment"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Investments;
