import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { investmentPlans } from "@/components/landing/InvestmentPlans";

// Mock active investments - replace with API
const activeInvestments = [
  { id: "1", user: "john@example.com", plan: "108 Circle", amount: 108, startDate: "2024-01-20", endDate: "2024-01-30", status: "active" },
  { id: "2", user: "jane@example.com", plan: "2222 Investment", amount: 2222, startDate: "2024-01-18", endDate: "2024-01-28", status: "active" },
  { id: "3", user: "mike@example.com", plan: "8888 Investment", amount: 8888, startDate: "2024-01-15", endDate: "2024-01-25", status: "completed" },
  { id: "4", user: "sarah@example.com", plan: "Tier 3 Investment", amount: 25000, startDate: "2024-01-22", endDate: "2024-02-01", status: "active" },
];

const AdminInvestments = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Investment plans summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {investmentPlans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-2xl font-bold mt-1">${plan.amount.toLocaleString()}</p>
                <p className="text-sm text-primary mt-1">{plan.roi}% ROI Daily</p>
                <p className="text-xs text-muted-foreground mt-1">Duration: {plan.duration}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active investments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeInvestments.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.user}</TableCell>
                    <TableCell className="font-medium">{inv.plan}</TableCell>
                    <TableCell>${inv.amount.toLocaleString()}</TableCell>
                    <TableCell>{inv.startDate}</TableCell>
                    <TableCell>{inv.endDate}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inv.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInvestments;
