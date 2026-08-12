import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BursaryLayout } from "@/components/layout/BursaryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bursaryApi } from "@/lib/api/bursary";
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Search, RefreshCw, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, Calendar, User } from "lucide-react";

interface PaymentRecord {
  id: string;
  transactionRef: string;
  amount: number;
  paymentMethod: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "RECONCILED";
  paymentDate: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  parent?: {
    id: string;
    primaryGuardian: any;
  };
  feeCollection?: {
    id: string;
    amount: number;
    balance: number;
  };
}

export default function PaymentReconciliation() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: paymentsData, isLoading, refetch } = useQuery({
    queryKey: ["bursary-payments", page, limit, statusFilter, searchQuery],
    queryFn: () => bursaryApi.getPayments({
      page,
      limit,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      search: searchQuery || undefined,
    }),
  });

  const payments = paymentsData?.data || [];
  const total = paymentsData?.meta?.total || 0;
  const totalPages = paymentsData?.meta?.totalPages || 1;

  const reconcileMutation = useMutation({
    mutationFn: ({ paymentId, feeCollectionId }: { paymentId: string; feeCollectionId: string }) =>
      bursaryApi.reconcilePayment(paymentId, feeCollectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bursary-payments"] });
      queryClient.invalidateQueries({ queryKey: ["bursary-stats"] });
      setIsDialogOpen(false);
      setSelectedPayment(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (paymentId: string) => bursaryApi.rejectPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bursary-payments"] });
      queryClient.invalidateQueries({ queryKey: ["bursary-stats"] });
      setIsDialogOpen(false);
      setSelectedPayment(null);
    },
  });

  const handleReconcile = (feeCollectionId: string) => {
    if (selectedPayment) {
      reconcileMutation.mutate({ paymentId: selectedPayment.id, feeCollectionId });
    }
  };

  const handleReject = () => {
    if (selectedPayment) {
      rejectMutation.mutate(selectedPayment.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case "SUCCESS":
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="mr-1 h-3 w-3" />Success</Badge>;
      case "FAILED":
        return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>;
      case "RECONCILED":
        return <Badge className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Reconciled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <BursaryLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Reconciliation</h1>
            <p className="text-muted-foreground mt-1">Match and reconcile parent payments with fee collections</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by transaction reference, student name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="RECONCILED">Reconciled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No payments found.
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment: PaymentRecord) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.transactionRef}</TableCell>
                          <TableCell>
                            {payment.student ? (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{payment.student.firstName} {payment.student.lastName}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unknown</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" />
                              <span className="font-semibold">{payment.amount.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.paymentMethod}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            {payment.status === "SUCCESS" && !payment.feeCollection && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Reconcile
                              </Button>
                            )}
                            {payment.status === "RECONCILED" && (
                              <Badge className="bg-green-600">Matched</Badge>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reconcile Payment</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm text-muted-foreground">Transaction Ref</Label>
                    <p className="font-mono text-sm">{selectedPayment.transactionRef}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Amount</Label>
                    <p className="font-semibold">₦{selectedPayment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Student</Label>
                    <p>{selectedPayment.student ? `${selectedPayment.student.firstName} ${selectedPayment.student.lastName}` : "Unknown"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Payment Date</Label>
                    <p>{new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feeCollection">Select Fee Collection to Match</Label>
                  <Select onValueChange={handleReconcile}>
                    <SelectTrigger id="feeCollection">
                      <SelectValue placeholder="Select fee collection..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select a fee collection</SelectItem>
                      <SelectItem value="manual-1">Manual Entry (Option)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Note: Fee collections should be fetched from the student's outstanding fees
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isPending}>
                    {rejectMutation.isPending ? "Rejecting..." : "Reject Payment"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </BursaryLayout>
  );
}
