import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BursaryLayout } from "@/components/layout/BursaryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { bursaryApi } from "@/lib/api/bursary";
import { Loader2, FileText, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GenerateInvoices() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [academicYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["bursary-sessions"],
    queryFn: () => bursaryApi.getAllSessions(),
  });

  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: ["bursary-bills", academicYear, term],
    queryFn: () => bursaryApi.getAllBills({ academicYear, term }),
    enabled: !!academicYear && !!term,
  });

  const mutation = useMutation({
    mutationFn: (data: { academicYear: string; term: string; billIds?: string[] }) =>
      bursaryApi.generateInvoices(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bursary-stats"] });
      queryClient.invalidateQueries({ queryKey: ["bursary-fee-collections"] });
    },
  });

  const handleBillToggle = (billId: string) => {
    setSelectedBillIds((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId]
    );
  };

  const handleSelectAllBills = () => {
    if (selectedBillIds.length === billsData?.data?.length) {
      setSelectedBillIds([]);
    } else {
      setSelectedBillIds(billsData?.data?.map((bill: any) => bill.id) || []);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicYear || !term) {
      return;
    }
    mutation.mutate({
      academicYear,
      term: term.toUpperCase().replace(/ /g, "_"),
      billIds: selectedBillIds.length > 0 ? selectedBillIds : undefined,
    });
  };

  return (
    <BursaryLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Invoices</h1>
          <p className="text-muted-foreground mt-1">Create invoices for students based on bills</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Generation Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear} disabled={sessionsLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionsData?.data?.map((session: any) => (
                        <SelectItem key={session.id} value={session.session}>
                          {session.session}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Select value={term} onValueChange={setTerm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIRST_TERM">First Term</SelectItem>
                      <SelectItem value="SECOND_TERM">Second Term</SelectItem>
                      <SelectItem value="THIRD_TERM">Third Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!academicYear || !term || mutation.isPending}
                className="w-full md:w-auto"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Invoices
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {academicYear && term && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Available Bills
                </span>
                {billsData?.data && billsData.data.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllBills}
                  >
                    {selectedBillIds.length === billsData.data.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {billsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : billsData?.data && billsData.data.length > 0 ? (
                <div className="space-y-3">
                  {billsData.data.map((bill: any) => (
                    <div
                      key={bill.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={bill.id}
                        checked={selectedBillIds.includes(bill.id)}
                        onCheckedChange={() => handleBillToggle(bill.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={bill.id}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{bill.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {bill.scope} • {bill.isCompulsory ? "Compulsory" : "Optional"}
                            </p>
                          </div>
                          <p className="font-semibold">₦{bill.amount.toLocaleString()}</p>
                        </label>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground">
                    {selectedBillIds.length} of {billsData.data.length} bills selected
                  </p>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No bills found for this academic year and term.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {mutation.data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Invoice Generation Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Academic Year</p>
                    <p className="text-lg font-semibold">{mutation.data.data.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Term</p>
                    <p className="text-lg font-semibold">{mutation.data.data.term}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bills Processed</p>
                    <p className="text-lg font-semibold">{mutation.data.data.billsProcessed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Invoices Created</p>
                    <p className="text-lg font-semibold text-green-600">{mutation.data.data.created}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Skipped (Already Exists)</p>
                    <p className="text-lg font-semibold text-orange-600">{mutation.data.data.skipped}</p>
                  </div>
                </div>
                <Button onClick={() => navigate("/bursary/fee-collections")} className="w-full">
                  View Generated Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {mutation.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to generate invoices. Please check your parameters and try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </BursaryLayout>
  );
}
