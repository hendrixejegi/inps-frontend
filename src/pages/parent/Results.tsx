import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ParentLayout } from '@/components/layout/ParentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parentApi } from '@/lib/api/parent';
import { Child, ChildResults } from '@/lib/types/parent';
import { ResultsTable } from '@/components/results/ResultsTable';
import { ResultsSummary } from '@/components/results/ResultsSummary';
import { ReportCardLayout } from '@/components/results/ReportCardLayout';
import {
  WalletCards,
  Loader2,
  AlertCircle,
  Download,
  FileText,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateParentResultsPDF } from '@/lib/utils/pdfGenerator';
import { generatePDFFromRef } from '@/lib/utils/html2pdfGenerator';
import { useAlert } from '@/contexts/alert-context';
import { transformParentToUnified } from '@/lib/types/results';

interface Session {
  id: string;
  session: string;
}

export default function ParentResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showAlert, showSuccess } = useAlert();

  const [selectedChildId, setSelectedChildId] = useState(
    searchParams.get('studentId') || '',
  );
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedTermId, setSelectedTermId] = useState('');
  const [viewMode, setViewMode] = useState<'detail' | 'summary' | 'reportcard'>(
    'detail',
  );
  const reportCardRef = useRef<HTMLDivElement>(null);

  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ['parent-children'],
    queryFn: () => parentApi.getMyChildren(),
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['parent-sessions'],
    queryFn: () => parentApi.getSessions(),
  });

  const { data: currentTermData } = useQuery({
    queryKey: ['parent-current-term'],
    queryFn: () => parentApi.getCurrentTerm(),
  });

  const { data: currentSessionData } = useQuery({
    queryKey: ['parent-current-session'],
    queryFn: () => parentApi.getCurrentSession(),
  });

  const {
    data: resultsData,
    isLoading: resultsLoading,
    error: resultsError,
  } = useQuery({
    queryKey: [
      'parent-child-results',
      selectedChildId,
      selectedSessionId,
      selectedTermId,
      viewMode,
    ],
    queryFn: () =>
      parentApi.getChildResults(selectedChildId, {
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
    const urlChildId = searchParams.get('studentId');
    if (urlChildId && urlChildId !== selectedChildId) {
      setSelectedChildId(urlChildId);
    }
  }, [searchParams, selectedChildId]);

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

  const handleDownloadPDF = async () => {
    if (!selectedChildId || !results) {
      showAlert('Please select a child and view results first', 'error');
      return;
    }

    try {
      const child = children.find((c: Child) => c.id === selectedChildId);
      if (!child) {
        showAlert('Child not found', 'error');
        return;
      }

      // For report card mode, the PDF generation is handled by the component
      // For other modes, use the existing jsPDF approach
      if (viewMode !== 'reportcard') {
        await generateParentResultsPDF(child, results, {
          filename: `ReportCard_${child.admissionNumber}.pdf`,
        });
        showSuccess('Report card generated successfully');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      showAlert('Failed to generate PDF. Please try again.', 'error');
    }
  };

  return (
    <ParentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-muted-foreground mt-1">
            View your children's academic performance
          </p>
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
                <Select
                  value={selectedChildId}
                  onValueChange={handleChildChange}
                  disabled={childrenLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child: Child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.firstName} {child.lastName} (
                        {child.admissionNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Session</label>
                <Select
                  value={selectedSessionId}
                  onValueChange={setSelectedSessionId}
                  disabled={sessionsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session: Session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.session}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Term</label>
                <Select
                  value={selectedTermId}
                  onValueChange={setSelectedTermId}
                >
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
                <Select
                  value={viewMode}
                  onValueChange={(value: 'detail' | 'summary' | 'reportcard') =>
                    setViewMode(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detail">Detailed View</SelectItem>
                    <SelectItem value="summary">Summary View</SelectItem>
                    <SelectItem value="reportcard">Report Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleViewResults}
                disabled={
                  !selectedChildId ||
                  !selectedSessionId ||
                  !selectedTermId ||
                  resultsLoading
                }
                className="flex-1"
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
              {viewMode !== 'reportcard' && (
                <Button
                  onClick={handleDownloadPDF}
                  disabled={!results || resultsLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        {resultsError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load results. Please ensure the child has verified
              results for the selected session and term.
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
            {viewMode === 'summary' && results.summary && (
              <>
                <ResultsSummary summary={results.summary} />

                <Card>
                  <CardHeader>
                    <CardTitle>Remarks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold mb-1">
                        Class Teacher Remark:
                      </p>
                      <p className="text-muted-foreground">
                        {results.classTeacherRemark || 'No remark provided'}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Head Teacher Remark:</p>
                      <p className="text-muted-foreground">
                        {results.headTeacherRemark || 'No remark provided'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Detailed View */}
            {viewMode === 'detail' &&
              results.results &&
              results.results.length > 0 && (
                <ResultsTable
                  results={
                    transformParentToUnified(
                      results,
                      children.find((c: Child) => c.id === selectedChildId),
                    ).results
                  }
                />
              )}

            {viewMode === 'detail' &&
              (!results.results || results.results.length === 0) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No verified results found for the selected session and term.
                  </AlertDescription>
                </Alert>
              )}

            {/* Report Card View */}
            {viewMode === 'reportcard' && (
              <div className="overflow-x-auto">
                <div ref={reportCardRef} className="w-[794px]">
                  <ReportCardLayout
                    data={transformParentToUnified(
                      results,
                      children.find((c: Child) => c.id === selectedChildId),
                    )}
                    showAsPreview={true}
                    showControls={true}
                    pdfFilename={`ReportCard_${children.find((c: Child) => c.id === selectedChildId)?.admissionNumber}.pdf`}
                    onGeneratePDF={async (filename) => {
                      try {
                        await generatePDFFromRef(reportCardRef, { filename });
                        showSuccess('Report card generated successfully');
                      } catch (error) {
                        showAlert(
                          'Failed to generate PDF. Please try again.',
                          'error',
                        );
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
