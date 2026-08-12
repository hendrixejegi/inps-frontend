import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Save, Upload, Download, FileText } from "lucide-react";

interface ProgressTrackerProps {
  completedEntries: number;
  totalEntries: number;
  onSaveDraft: () => void;
  onSubmitAll: () => void;
  onExportCSV: () => void;
  onImportCSV: () => void;
  saving?: boolean;
  submitting?: boolean;
}

export default function ProgressTracker({
  completedEntries,
  totalEntries,
  onSaveDraft,
  onSubmitAll,
  onExportCSV,
  onImportCSV,
  saving = false,
  submitting = false,
}: ProgressTrackerProps) {
  const percentage = totalEntries > 0 
    ? Math.round((completedEntries / totalEntries) * 100) 
    : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Progress: {completedEntries}/{totalEntries} entries completed ({percentage}%)
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={onSubmitAll}
            disabled={submitting || completedEntries === 0}
            size="sm"
          >
            <FileText className="mr-2 h-4 w-4" />
            {submitting ? "Submitting..." : "Submit All"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onImportCSV}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}