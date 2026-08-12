import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BursaryLayout } from "@/components/layout/BursaryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bursaryApi } from "@/lib/api/bursary";
import { DollarSign, Receipt, TrendingUp, Users, CreditCard, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BursaryDashboard() {
  const navigate = useNavigate();
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["bursary-stats"],
    queryFn: () => bursaryApi.getStats(),
  });

  const stats = statsData?.data;

  const statCards = [
    {
      title: "Total Receipts",
      value: stats?.totalReceipts || 0,
      icon: Receipt,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Transactions This Month",
      value: stats?.transactionsThisMonth || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Collected",
      value: `₦${(stats?.totalCollected || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Outstanding",
      value: `₦${(stats?.totalOutstanding || 0).toLocaleString()}`,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const paymentStatCards = [
    {
      title: "Pending Payments",
      value: stats?.pendingPayments || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Successful Today",
      value: `₦${(stats?.successfulToday || 0).toLocaleString()}`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Online Payments",
      value: stats?.totalOnlinePayments || 0,
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <BursaryLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bursary Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of school finances and payments</p>
        </div>

        {statsError && (
          <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            Failed to load dashboard data. Please try again later.
          </div>
        )}

        {statsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`size-8 rounded-full p-2 ${stat.bgColor}`}>
                      <stat.icon className={`size-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {paymentStatCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`size-8 rounded-full p-2 ${stat.bgColor}`}>
                      <stat.icon className={`size-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Students Owing Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-600">
                    {stats?.studentsOwing || 0}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Students with outstanding balances
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Collection Rate</span>
                      <span className="text-sm font-semibold">
                        {stats?.totalCollected && stats?.totalOutstanding
                          ? `${(
                              (stats.totalCollected / (stats.totalCollected + stats.totalOutstanding)) * 100
                            ).toFixed(1)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: stats?.totalCollected && stats?.totalOutstanding
                            ? `${(stats.totalCollected / (stats.totalCollected + stats.totalOutstanding)) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <button
                    onClick={() => navigate("/bursary/bills")}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Receipt className="size-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold">Manage Bills</div>
                      <div className="text-sm text-muted-foreground">Create and update fee bills</div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate("/bursary/invoices")}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <DollarSign className="size-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-semibold">Generate Invoices</div>
                      <div className="text-sm text-muted-foreground">Create student invoices</div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate("/bursary/fee-collections")}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <TrendingUp className="size-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-semibold">View Collections</div>
                      <div className="text-sm text-muted-foreground">Payment history</div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate("/bursary/payments/reconciliation")}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <CreditCard className="size-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-semibold">Reconcile Payments</div>
                      <div className="text-sm text-muted-foreground">Match payments to collections</div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </BursaryLayout>
  );
}
