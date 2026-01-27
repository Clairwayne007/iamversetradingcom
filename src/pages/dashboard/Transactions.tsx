import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

// Mock transactions - replace with API
const allTransactions = [
  { id: 1, type: "deposit", amount: 2000, crypto: "BTC", status: "successful", date: "2024-01-25 14:30", txHash: "abc123..." },
  { id: 2, type: "investment", amount: 1000, plan: "108 Circle", status: "successful", date: "2024-01-24 10:15" },
  { id: 3, type: "earning", amount: 100, plan: "108 Circle", status: "successful", date: "2024-01-23 08:00" },
  { id: 4, type: "withdrawal", amount: 500, crypto: "ETH", status: "pending", date: "2024-01-22 16:45", txHash: "def456..." },
  { id: 5, type: "deposit", amount: 5000, crypto: "USDT", status: "successful", date: "2024-01-21 09:00", txHash: "ghi789..." },
  { id: 6, type: "withdrawal", amount: 1000, crypto: "BTC", status: "failed", date: "2024-01-20 11:30", txHash: "jkl012..." },
];

const Transactions = () => {
  const deposits = allTransactions.filter((tx) => tx.type === "deposit");
  const withdrawals = allTransactions.filter((tx) => tx.type === "withdrawal");
  const investments = allTransactions.filter((tx) => tx.type === "investment" || tx.type === "earning");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <TransactionList transactions={allTransactions} />
              </TabsContent>

              <TabsContent value="deposits">
                <TransactionList transactions={deposits} />
              </TabsContent>

              <TabsContent value="withdrawals">
                <TransactionList transactions={withdrawals} />
              </TabsContent>

              <TabsContent value="investments">
                <TransactionList transactions={investments} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

interface Transaction {
  id: number;
  type: string;
  amount: number;
  crypto?: string;
  plan?: string;
  status: string;
  date: string;
  txHash?: string;
}

const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                tx.type === "deposit" || tx.type === "earning"
                  ? "bg-success/10 text-success"
                  : tx.type === "withdrawal"
                  ? "bg-warning/10 text-warning"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {tx.type === "deposit" ? (
                <ArrowDownRight className="h-5 w-5" />
              ) : tx.type === "withdrawal" ? (
                <ArrowUpRight className="h-5 w-5" />
              ) : tx.type === "earning" ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-medium capitalize">{tx.type}</p>
              <p className="text-sm text-muted-foreground">
                {tx.crypto || tx.plan || "Investment"} • {tx.date}
              </p>
              {tx.txHash && (
                <p className="text-xs text-muted-foreground font-mono">{tx.txHash}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold ${
                tx.type === "deposit" || tx.type === "earning"
                  ? "text-success"
                  : tx.type === "withdrawal"
                  ? "text-foreground"
                  : "text-primary"
              }`}
            >
              {tx.type === "deposit" || tx.type === "earning" ? "+" : "-"}$
              {tx.amount.toLocaleString()}
            </p>
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded-full ${
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
  );
};

export default Transactions;
