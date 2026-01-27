import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TrendingUp, TrendingDown, Wallet, Clock, DollarSign, BarChart3 } from "lucide-react";

// Mock data - replace with API calls
const portfolioStats = {
  totalInvested: 5000,
  totalEarnings: 750,
  activeInvestments: 2,
  pendingWithdrawals: 200,
};

const recentTransactions = [
  { id: 1, type: "deposit", amount: 2000, status: "successful", date: "2024-01-25" },
  { id: 2, type: "investment", amount: 1000, status: "successful", date: "2024-01-24" },
  { id: 3, type: "earning", amount: 100, status: "successful", date: "2024-01-23" },
  { id: 4, type: "withdrawal", amount: 500, status: "pending", date: "2024-01-22" },
];

const activeInvestments = [
  { id: 1, plan: "108 Circle", amount: 108, roi: 10, daysLeft: 10, earned: 54 },
  { id: 2, plan: "2222 Investment", amount: 2222, roi: 20, daysLeft: 7, earned: 888 },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome message */}
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}!</h2>
          <p className="text-muted-foreground">Here's your portfolio overview</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Invested"
            value={`$${portfolioStats.totalInvested.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Earnings"
            value={`$${portfolioStats.totalEarnings.toLocaleString()}`}
            icon={TrendingUp}
            trend={{ value: 8.5, isPositive: true }}
          />
          <StatCard
            title="Active Investments"
            value={portfolioStats.activeInvestments.toString()}
            icon={BarChart3}
          />
          <StatCard
            title="Available Balance"
            value={`$${user?.balance?.toLocaleString() || "0"}`}
            icon={Wallet}
          />
        </div>

        {/* Active investments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Active Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeInvestments.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div>
                    <p className="font-medium">{inv.plan}</p>
                    <p className="text-sm text-muted-foreground">
                      ${inv.amount.toLocaleString()} • {inv.roi}% ROI Daily
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-success">+${inv.earned.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{inv.daysLeft} days left</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        tx.type === "deposit" || tx.type === "earning"
                          ? "bg-success/10 text-success"
                          : tx.type === "withdrawal"
                          ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "earning" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        tx.type === "deposit" || tx.type === "earning"
                          ? "text-success"
                          : ""
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "earning" ? "+" : "-"}$
                      {tx.amount.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === "successful"
                          ? "bg-success/10 text-success"
                          : tx.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-1 text-sm ${
                trend.isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
