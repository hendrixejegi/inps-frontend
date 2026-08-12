import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BursaryLayout } from "@/components/layout/BursaryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bursaryApi } from "@/lib/api/bursary";
import { Download, Calendar, TrendingUp, TrendingDown, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PaymentReport {
  id: string;
  transactionRef: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  feeCollection?: {
    id: string;
    term: string;
    session: string;
  };
}

export default function PaymentReports() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [dateRange, setDateRange] = useState<string>("this_month");
  const [paymentMethod, setPaymentMethod] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["bursary-payment-reports", page, limit, dateRange, paymentMethod, status],
    queryFn: () => bursaryApi.getPaymentReports({
      page,
      limit,
      dateRange,
      paymentMethod: paymentMethod === "ALL" ? undefined : paymentMethod,
      status: status === "ALL" ? undefined : status,
    }),
  });

  const reports = reportData?.data || [];
  const total = reportData?.meta?.total || 0;
  const totalPages = reportData?.meta?.totalPages || 1;
  const summary = reportData?.summary || {
    totalAmount: 0,
    successfulAmount: 0,
    pendingAmount: 0,
    failedAmount: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
  };

  const exportReport = () => {
    // Export functionality would be implemented here
    console.log("Exporting report...");
  };

  return (
    <BursaryLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Reports</h1>
            <p className="text-muted-foreground mt-1">View and analyze payment transactions</p>
          </div>
          <Button onClick={exportReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">All payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{summary.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{summary.successfulAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{summary.successfulTransactions} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₦{summary.pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{summary.pendingTransactions} transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-48">
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="dateRange">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="this_year">This Year</SelectItem>
                    <SelectItem value="all_time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Methods</SelectItem>
                    <SelectItem value="PAYSTACK">Paystack</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="POS">POS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="RECONCILED">Reconciled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No payment transactions found.
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction Ref</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Term/Session</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report: PaymentReport) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-mono text-sm">{report.transactionRef}</TableCell>
                          <TableCell>
                            {report.student ? (
                              `${report.student.firstName} ${report.student.lastName}`
                            ) : (
                              <span className="text-muted-foreground">Unknown</span>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold">₦{report.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.paymentMethod}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(report.paymentDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.status === "SUCCESS" || report.status === "RECONCILED"
                                  ? "default"
                                  : report.status === "FAILED"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {report.feeCollection ? (
                              <span className="text-sm">
                                {report.feeCollection.term} / {report.feeCollection.session}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </BursaryLayout>
  );
}
