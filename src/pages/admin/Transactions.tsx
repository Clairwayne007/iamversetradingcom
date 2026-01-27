import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Search, MoreHorizontal, Check, X, Clock } from "lucide-react";

// Mock transactions - replace with API
const mockTransactions = [
  { id: "1", user: "john@example.com", type: "deposit", amount: 5000, crypto: "BTC", status: "successful", date: "2024-01-25" },
  { id: "2", user: "jane@example.com", type: "withdrawal", amount: 2000, crypto: "ETH", status: "pending", date: "2024-01-25" },
  { id: "3", user: "mike@example.com", type: "deposit", amount: 1500, crypto: "USDT", status: "successful", date: "2024-01-24" },
  { id: "4", user: "sarah@example.com", type: "withdrawal", amount: 800, crypto: "BTC", status: "failed", date: "2024-01-24" },
  { id: "5", user: "tom@example.com", type: "deposit", amount: 3000, crypto: "LTC", status: "pending", date: "2024-01-23" },
];

const AdminTransactions = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleStatusUpdate = (txId: string, newStatus: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, status: newStatus } : tx))
    );
    toast({
      title: "Transaction Updated",
      description: `Transaction marked as ${newStatus}`,
    });
  };

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.includes(searchQuery)
  );

  const pendingTransactions = filteredTransactions.filter((tx) => tx.status === "pending");
  const completedTransactions = filteredTransactions.filter((tx) => tx.status !== "pending");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <TransactionTable
                  transactions={pendingTransactions}
                  onStatusUpdate={handleStatusUpdate}
                  showActions
                />
              </TabsContent>

              <TabsContent value="all">
                <TransactionTable
                  transactions={filteredTransactions}
                  onStatusUpdate={handleStatusUpdate}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

interface Transaction {
  id: string;
  user: string;
  type: string;
  amount: number;
  crypto: string;
  status: string;
  date: string;
}

const TransactionTable = ({
  transactions,
  onStatusUpdate,
  showActions = false,
}: {
  transactions: Transaction[];
  onStatusUpdate: (id: string, status: string) => void;
  showActions?: boolean;
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Crypto</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="font-mono text-sm">{tx.id}</TableCell>
            <TableCell>{tx.user}</TableCell>
            <TableCell className="capitalize">{tx.type}</TableCell>
            <TableCell>${tx.amount.toLocaleString()}</TableCell>
            <TableCell>{tx.crypto}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tx.status === "successful"
                    ? "bg-success/10 text-success"
                    : tx.status === "failed"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {tx.status}
              </span>
            </TableCell>
            <TableCell>{tx.date}</TableCell>
            <TableCell className="text-right">
              {showActions && tx.status === "pending" ? (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-success hover:text-success"
                    onClick={() => onStatusUpdate(tx.id, "successful")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onStatusUpdate(tx.id, "failed")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    {tx.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => onStatusUpdate(tx.id, "successful")}>
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusUpdate(tx.id, "failed")}>
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminTransactions;
