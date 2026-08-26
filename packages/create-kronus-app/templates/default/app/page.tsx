import { Badge } from "@kronus-ui/ui/badge";
import { Button } from "@kronus-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kronus-ui/ui/card";
import { Input } from "@kronus-ui/ui/input";
import { Metric, MetricDelta, MetricLabel, MetricValue } from "@kronus-ui/ui/metric";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@kronus-ui/ui/table";

const stats = [
  { label: "Revenue", value: "R$ 48.2k", delta: "+12.5%", trend: "up" as const },
  { label: "Active users", value: "2,318", delta: "+4.1%", trend: "up" as const },
  { label: "Churn", value: "1.8%", delta: "-0.3%", trend: "down" as const },
  { label: "NPS", value: "72", delta: "+6", trend: "up" as const },
];

const orders = [
  { id: "#1042", customer: "Ana Lima", status: "Paid", amount: "R$ 320,00" },
  { id: "#1041", customer: "Bruno Sá", status: "Pending", amount: "R$ 89,90" },
  { id: "#1040", customer: "Carla Reis", status: "Paid", amount: "R$ 1.249,00" },
  { id: "#1039", customer: "Diego Melo", status: "Refunded", amount: "R$ 59,00" },
];

const statusVariant = {
  Paid: "success",
  Pending: "warning",
  Refunded: "destructive",
} as const;

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="primary" className="w-fit">
            Built with Kronus UI
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-fg">Dashboard</h1>
          <p className="max-w-prose text-fg-secondary">
            A starter wired with <code className="text-fg">@kronus-ui/ui</code>, tokens, and the
            theme provider. Edit <code className="text-fg">app/page.tsx</code> to make it yours.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Docs</Button>
          <Button variant="primary">New project</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <Metric>
                <MetricLabel>{stat.label}</MetricLabel>
                <MetricValue>{stat.value}</MetricValue>
                <MetricDelta trend={stat.trend}>{stat.delta}</MetricDelta>
              </Metric>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest activity across your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status as keyof typeof statusVariant]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite a teammate</CardTitle>
            <CardDescription>Send an invite to collaborate.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input type="email" placeholder="name@company.com" aria-label="Teammate email" />
            <Button className="w-full">Send invite</Button>
            <p className="text-sm text-fg-secondary">
              Add components anytime with <code className="text-fg">npx kronus-ui add</code>.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
