import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

// Mock chart data - replace with real API data
const btcData = [
  { time: "00:00", price: 42000 },
  { time: "04:00", price: 42500 },
  { time: "08:00", price: 43200 },
  { time: "12:00", price: 42800 },
  { time: "16:00", price: 43500 },
  { time: "20:00", price: 44000 },
  { time: "24:00", price: 43800 },
];

const ethData = [
  { time: "00:00", price: 2200 },
  { time: "04:00", price: 2250 },
  { time: "08:00", price: 2180 },
  { time: "12:00", price: 2300 },
  { time: "16:00", price: 2350 },
  { time: "20:00", price: 2280 },
  { time: "24:00", price: 2320 },
];

const marketAssets = [
  { symbol: "BTC", name: "Bitcoin", price: 43800, change: 2.5, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 2320, change: -1.2, volume: "15.2B" },
  { symbol: "EUR/USD", name: "Euro/Dollar", price: 1.0845, change: 0.15, volume: "8.5B" },
  { symbol: "GOLD", name: "Gold", price: 2045, change: 0.8, volume: "5.2B" },
  { symbol: "SPX", name: "S&P 500", price: 4890, change: 1.1, volume: "12.4B" },
  { symbol: "SOL", name: "Solana", price: 98.5, change: 5.2, volume: "2.8B" },
];

const Trading = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Market overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MarketCard symbol="BTC/USD" price="$43,800" change={2.5} />
          <MarketCard symbol="ETH/USD" price="$2,320" change={-1.2} />
          <MarketCard symbol="EUR/USD" price="$1.0845" change={0.15} />
          <MarketCard symbol="GOLD" price="$2,045" change={0.8} />
        </div>

        {/* Chart section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Trading Charts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="btc">
              <TabsList className="mb-4">
                <TabsTrigger value="btc">BTC/USD</TabsTrigger>
                <TabsTrigger value="eth">ETH/USD</TabsTrigger>
                <TabsTrigger value="forex">Forex</TabsTrigger>
                <TabsTrigger value="commodities">Commodities</TabsTrigger>
              </TabsList>

              <TabsContent value="btc">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={btcData}>
                      <defs>
                        <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#colorBtc)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="eth">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ethData}>
                      <defs>
                        <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#colorEth)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="forex">
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  Forex charts coming soon...
                </div>
              </TabsContent>

              <TabsContent value="commodities">
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  Commodities charts coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Market assets table */}
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Asset</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">24h Change</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {marketAssets.map((asset) => (
                    <tr key={asset.symbol} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{asset.symbol}</p>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4 font-medium">
                        ${asset.price.toLocaleString()}
                      </td>
                      <td className={`text-right py-4 px-4 font-medium ${asset.change >= 0 ? "text-success" : "text-destructive"}`}>
                        <span className="flex items-center justify-end gap-1">
                          {asset.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {asset.change >= 0 ? "+" : ""}{asset.change}%
                        </span>
                      </td>
                      <td className="text-right py-4 px-4 text-muted-foreground">
                        ${asset.volume}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const MarketCard = ({ symbol, price, change }: { symbol: string; price: string; change: number }) => (
  <Card>
    <CardContent className="pt-4">
      <p className="text-sm text-muted-foreground">{symbol}</p>
      <p className="text-xl font-bold mt-1">{price}</p>
      <div className={`flex items-center gap-1 mt-1 text-sm ${change >= 0 ? "text-success" : "text-destructive"}`}>
        {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{change >= 0 ? "+" : ""}{change}%</span>
      </div>
    </CardContent>
  </Card>
);

export default Trading;
