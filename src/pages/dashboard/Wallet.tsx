import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Copy, Bitcoin, DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cryptoOptions = [
  { id: "btc", name: "Bitcoin (BTC)", icon: Bitcoin },
  { id: "eth", name: "Ethereum (ETH)", icon: DollarSign },
  { id: "usdt", name: "USDT (TRC20)", icon: DollarSign },
  { id: "ltc", name: "Litecoin (LTC)", icon: DollarSign },
];

// Mock wallet address - would come from NOWPayments API
const depositAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

const Wallet = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [isProcessing, setIsProcessing] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard" });
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    // TODO: Integrate with NOWPayments API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Deposit Initiated",
        description: `Please send ${depositAmount} USD worth of ${selectedCrypto.toUpperCase()} to the address below`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to initiate deposit", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (parseFloat(withdrawAmount) > (user?.balance || 0)) {
      toast({ title: "Error", description: "Insufficient balance", variant: "destructive" });
      return;
    }

    if (!withdrawAddress) {
      toast({ title: "Error", description: "Please enter your wallet address", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    // TODO: Integrate with backend API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      updateUser({ balance: (user?.balance || 0) - parseFloat(withdrawAmount) });
      
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal is being processed",
      });
      
      setWithdrawAmount("");
      setWithdrawAddress("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to process withdrawal", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance card */}
        <Card className="bg-gradient-to-r from-primary to-cyan-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-primary-foreground">
              <div>
                <p className="text-sm opacity-90">Available Balance</p>
                <p className="text-4xl font-bold mt-1">${user?.balance?.toLocaleString() || "0.00"}</p>
                <p className="text-sm opacity-90 mt-2">USD</p>
              </div>
              <WalletIcon className="h-16 w-16 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Deposit/Withdraw tabs */}
        <Tabs defaultValue="deposit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit" className="gap-2">
              <ArrowDownRight className="h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Cryptocurrency</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crypto" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoOptions.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          {crypto.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Send your {selectedCrypto.toUpperCase()} to this address:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-background rounded text-xs break-all">
                      {depositAddress}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: Payment will be processed via NOWPayments. Deposits are credited after network confirmation.
                  </p>
                </div>

                <Button className="w-full" onClick={handleDeposit} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Generate Payment"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Cryptocurrency</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crypto" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoOptions.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          {crypto.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: ${user?.balance?.toLocaleString() || "0.00"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <Input
                    placeholder="Enter your wallet address"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={isProcessing || (user?.balance || 0) < parseFloat(withdrawAmount || "0")}
                >
                  {isProcessing ? "Processing..." : "Request Withdrawal"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent deposits */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No deposits yet
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
