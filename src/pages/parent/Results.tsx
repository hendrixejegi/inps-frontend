import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ParentLayout } from "@/components/layout/ParentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parentApi } from "@/lib/api/parent";
import { Child, ChildResults } from "@/lib/types/parent";
import { ResultsTable } from "@/components/parent/ResultsTable";
import { ResultsSummaryStats } from "@/components/parent/ResultsSummary";
import { WalletCards, Loader2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ParentResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedChildId, setSelectedChildId] = useState(searchParams.get("studentId") || "");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [viewMode, setViewMode] = useState<"detail" | "summary">("detail");

  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentApi.getMyChildren(),
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["parent-sessions"],
    queryFn: () => parentApi.getSessions(),
  });

  const { data: currentTermData } = useQuery({
    queryKey: ["parent-current-term"],
    queryFn: () => parentApi.getCurrentTerm(),
  });

  const { data: currentSessionData } = useQuery({
    queryKey: ["parent-current-session"],
    queryFn: () => parentApi.getCurrentSession(),
  });

  const { data: resultsData, isLoading: resultsLoading, error: resultsError } = useQuery({
    queryKey: ["parent-child-results", selectedChildId, selectedSessionId, selectedTermId, viewMode],
    queryFn: () => parentApi.getChildResults(selectedChildId, {
      termId: selectedTermId,
      sessionId: selectedSessionId,
      filter: viewMode,
    }),
    enabled: !!selectedChildId && !!selectedSessionId && !!selectedTermId,
  });

  const children = childrenData?.data || [];
  const sessions = sessionsData?.data || [];
  const currentTerm = currentTermData?.data;
  const currentSession = currentSessionData?.data;
  const results = resultsData?.data as ChildResults;

  // Set initial values when data loads
  useEffect(() => {
    if (!selectedSessionId && currentSession?.id) {
      setSelectedSessionId(currentSession.id);
    }
    if (!selectedTermId && currentTerm?.id) {
      setSelectedTermId(currentTerm.id);
    }
  }, [currentSession, currentTerm, selectedSessionId, selectedTermId]);

  // Update selected child when URL param changes
  useEffect(() => {
    const urlChildId = searchParams.get("studentId");
    if (urlChildId && urlChildId !== selectedChildId) {
      setSelectedChildId(urlChildId);
    }
  }, [searchParams]);

  const handleChildChange = (childId: string) => {
    setSelectedChildId(childId);
    setSearchParams({ studentId: childId });
  };

  const handleViewResults = () => {
    if (!selectedChildId || !selectedSessionId || !selectedTermId) {
      return;
    }
    // The query will automatically refetch when these values change
  };

  return (
    <ParentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-muted-foreground mt-1">View your children's academic performance</p>
        </div>

        {/* Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Select Results Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Child</label>
                <Select value={selectedChildId} onValueChange={handleChildChange} disabled={childrenLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child: Child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.firstName} {child.lastName} ({child.admissionNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Session</label>
                <Select value={selectedSessionId} onValueChange={setSelectedSessionId} disabled={sessionsLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session: any) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.session}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Term</label>
                <Select value={selectedTermId} onValueChange={setSelectedTermId}>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">View Mode</label>
                <Select value={viewMode} onValueChange={(value: "detail" | "summary") => setViewMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detail">Detailed View</SelectItem>
                    <SelectItem value="summary">Summary View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleViewResults}
              disabled={!selectedChildId || !selectedSessionId || !selectedTermId || resultsLoading}
              className="mt-4"
            >
              {resultsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <WalletCards className="mr-2 h-4 w-4" />
                  View Results
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Display */}
        {resultsError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load results. Please ensure the child has verified results for the selected session and term.
            </AlertDescription>
          </Alert>
        )}

        {resultsLoading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {results && !resultsLoading && (
          <div className="space-y-6">
            {/* Summary View */}
            {viewMode === "summary" && results.summary && (
              <>
                <ResultsSummaryStats summary={results.summary} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Remarks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold mb-1">Class Teacher Remark:</p>
                      <p className="text-muted-foreground">{results.classTeacherRemark || "No remark provided"}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Head Teacher Remark:</p>
                      <p className="text-muted-foreground">{results.headTeacherRemark || "No remark provided"}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Detailed View */}
            {viewMode === "detail" && results.results && results.results.length > 0 && (
              <ResultsTable results={results.results} />
            )}

            {viewMode === "detail" && (!results.results || results.results.length === 0) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No verified results found for the selected session and term.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
