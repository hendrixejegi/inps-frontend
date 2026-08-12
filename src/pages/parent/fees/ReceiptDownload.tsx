import { useEffect, useState } from "react";
import { ParentLayout } from "@/components/layout/ParentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2, FileText } from "lucide-react";
import { parentApi } from "@/lib/api/parent";

export default function ReceiptDownload() {
  const navigate = useNavigate();
  const { studentId, paymentId } = useParams<{ studentId: string; paymentId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // In a real implementation, this would generate a PDF receipt
    // For now, we'll show a simple receipt view
    setLoading(false);
  }, [paymentId]);

  const handleDownload = () => {
    // This would trigger PDF download
    // For now, we'll just navigate back
    navigate(`/parent/fees/${studentId}/history`);
  };

  if (loading) {
    return (
      <ParentLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/parent/fees/${studentId}/history`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Receipt</h1>
            <p className="text-muted-foreground mt-1">Receipt for payment: {paymentId}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center space-y-6">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Payment Receipt</h3>
              <p className="text-muted-foreground">
                Receipt for payment reference: {paymentId}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                PDF receipt generation will be implemented with a PDF library.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button variant="outline" onClick={() => navigate(`/parent/fees/${studentId}/history`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
}