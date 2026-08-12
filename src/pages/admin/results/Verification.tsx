import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import VerificationList from "@/components/results/VerificationList";

export default function ResultsVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  const [verifying, setVerifying] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    loadUnverifiedResults();
  }, [page]);

  const loadUnverifiedResults = async () => {
    try {
      setLoading(true);
      setPermissionDenied(false);
      const response = await adminApi.getUnverifiedResults({
        page,
        limit,
      });
      
      if (response.success) {
        const responseData = response.data as any;
        setResults(responseData.results || responseData);
        setTotal(responseData.total || responseData.length);
      }
    } catch (error: any) {
      console.error("Error loading unverified results:", error);
      if (error.message?.includes('Access denied') || error.message?.includes('HEAD_TEACHER')) {
        setPermissionDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (resultId: string) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(resultId)) {
      newSelected.delete(resultId);
    } else {
      newSelected.add(resultId);
    }
    setSelectedResults(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedResults.size === results.length) {
      setSelectedResults(new Set());
    } else {
      setSelectedResults(new Set(results.map((r: any) => r.id)));
    }
  };

  const handleVerifySelected = async () => {
    if (selectedResults.size === 0) {
      alert("Please select at least one result to verify");
      return;
    }

    setVerifying(true);
    try {
      let verifiedCount = 0;
      for (const resultId of selectedResults) {
        const response = await adminApi.verifyResult(resultId);
        if (response.success) {
          verifiedCount++;
        }
      }
      
      alert(`Successfully verified ${verifiedCount} results`);
      setSelectedResults(new Set());
      loadUnverifiedResults();
    } catch (error) {
      console.error("Error verifying results:", error);
      alert("Error verifying results. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyResult = async (resultId: string) => {
    try {
      const response = await adminApi.verifyResult(resultId);
      if (response.success) {
        loadUnverifiedResults();
      }
    } catch (error) {
      console.error("Error verifying result:", error);
      alert("Error verifying result. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/results")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Results Verification</h1>
              <p className="text-sm text-gray-600">Review and verify student results before final publication</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              disabled={results.length === 0 || permissionDenied}
            >
              {selectedResults.size === results.length ? "Deselect All" : "Select All"}
            </Button>
            <Button
              onClick={handleVerifySelected}
              disabled={selectedResults.size === 0 || verifying || permissionDenied}
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Selected ({selectedResults.size})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {!permissionDenied && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{total}</div>
                <p className="text-xs text-gray-600">Results awaiting review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selected</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{selectedResults.size}</div>
                <p className="text-xs text-gray-600">Results to verify</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {total > 0 ? Math.round(((total - results.length) / total) * 100) : 0}%
                </div>
                <p className="text-xs text-gray-600">Overall completion</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verification List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : permissionDenied ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
                <p className="text-gray-600 mb-4">Result verification is restricted to Head Teachers only.</p>
                <Button onClick={() => navigate("/admin/results")}>
                  Back to Dashboard
                </Button>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Results Verified</h3>
                <p className="text-gray-600">There are no pending results to verify.</p>
              </div>
            ) : (
              <VerificationList
                results={results}
                selectedResults={selectedResults}
                onSelectResult={handleSelectResult}
                onVerifyResult={handleVerifyResult}
              />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
