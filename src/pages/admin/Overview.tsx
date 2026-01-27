import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data - replace with API
const stats = {
  totalUsers: 1250,
  totalDeposits: 458000,
  totalWithdrawals: 125000,
  activeInvestments: 342,
};

const chartData = [
  { name: "Jan", deposits: 40000, withdrawals: 12000 },
  { name: "Feb", deposits: 55000, withdrawals: 18000 },
  { name: "Mar", deposits: 48000, withdrawals: 15000 },
  { name: "Apr", deposits: 62000, withdrawals: 22000 },
  { name: "May", deposits: 71000, withdrawals: 25000 },
  { name: "Jun", deposits: 68000, withdrawals: 20000 },
];

const recentActivity = [
  { id: 1, user: "john@example.com", action: "Deposit", amount: 500, date: "2024-01-25 14:30" },
  { id: 2, user: "jane@example.com", action: "Investment", amount: 1000, date: "2024-01-25 13:15" },
  { id: 3, user: "mike@example.com", action: "Withdrawal", amount: 200, date: "2024-01-25 12:00" },
  { id: 4, user: "sarah@example.com", action: "Registration", amount: 0, date: "2024-01-25 11:30" },
  { id: 5, user: "tom@example.com", action: "Deposit", amount: 2000, date: "2024-01-25 10:00" },
];

const AdminOverview = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Total Deposits"
            value={`$${stats.totalDeposits.toLocaleString()}`}
            icon={DollarSign}
            color="success"
          />
          <StatCard
            title="Total Withdrawals"
            value={`$${stats.totalWithdrawals.toLocaleString()}`}
            icon={TrendingUp}
            color="warning"
          />
          <StatCard
            title="Active Investments"
            value={stats.activeInvestments.toString()}
            icon={Activity}
            color="primary"
          />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="deposits"
                    stroke="hsl(var(--success))"
                    fill="url(#colorDeposits)"
                    name="Deposits"
                  />
                  <Area
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="hsl(var(--warning))"
                    fill="url(#colorWithdrawals)"
                    name="Withdrawals"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    {activity.amount > 0 && (
                      <p className="font-medium">${activity.amount.toLocaleString()}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "success" | "warning";
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOverview;
