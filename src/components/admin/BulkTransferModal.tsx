import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Student } from "@/lib/types/student";

interface Section {
  id: string;
  name: string;
  color?: string;
  roomNumber?: string;
  currentEnrollment: number;
}

interface Class {
  id: string;
  name: string;
  level: string;
  status: string;
  sections: Section[];
}

interface BulkTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  selectedStudents: Student[];
  onTransfer: (data: { transferMode: "section" | "class"; transfers: any[] }) => Promise<{ results: any[] }>;
}

export default function BulkTransferModal({
  isOpen,
  onClose,
  classes,
  selectedStudents,
  onTransfer,
}: BulkTransferModalProps) {
  const [transferMode, setTransferMode] = useState<"section" | "class">("section");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[] | null>(null);

  if (!isOpen) return null;

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSection = selectedClass?.sections.find((s) => s.id === selectedSectionId);

  const handleTransfer = async () => {
    if (!selectedSectionId) {
      setError("Please select a target section");
      return;
    }

    if (transferMode === "class" && !selectedClassId) {
      setError("Please select a target class");
      return;
    }

    setIsTransferring(true);
    setError("");
    setResults(null);

    try {
      const transfers = selectedStudents.map((student) => {
        const enrollmentId = student.enrollments?.[0]?.id;
        if (!enrollmentId) {
          return null; // Skip students without enrollment
        }
        return {
          enrollmentId,
          newClassId: transferMode === "class" ? selectedClassId : undefined,
          newSectionId: selectedSectionId,
        };
      }).filter(Boolean) as Array<{ enrollmentId: string; newClassId?: string; newSectionId: string }>;

      if (transfers.length === 0) {
        setError("No students with active enrollments selected");
        return;
      }

      const response = await onTransfer({ transferMode, transfers });
      setResults(response.results || []);
    } catch (err: any) {
      setError(err.message || "Failed to transfer students");
    } finally {
      setIsTransferring(false);
    }
  };

  const handleClose = () => {
    setTransferMode("section");
    setSelectedClassId("");
    setSelectedSectionId("");
    setError("");
    setResults(null);
    onClose();
  };

  const successCount = results?.filter((r) => r.success).length || 0;
  const failureCount = results?.filter((r) => !r.success).length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bulk Transfer Students</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Students Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Selected Students</h3>
                <p className="text-sm text-blue-700">
                  {selectedStudents.length} student(s) to transfer
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-700">
                  {selectedStudents.slice(0, 3).map((s) => s.admissionNumber).join(", ")}
                  {selectedStudents.length > 3 && ` +${selectedStudents.length - 3} more`}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
              <AlertCircle className="size-5" />
              <span>{error}</span>
            </div>
          )}

          {results && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="size-5" />
                <span className="font-semibold">Transfer Complete</span>
              </div>
              <div className="mt-2 text-sm text-green-600">
                {successCount} succeeded, {failureCount} failed
              </div>
            </div>
          )}

          {/* Transfer Mode Selection */}
          <div className="space-y-2">
            <Label>Transfer Mode</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={transferMode === "section" ? "default" : "outline"}
                onClick={() => {
                  setTransferMode("section");
                  setSelectedClassId("");
                  setSelectedSectionId("");
                }}
                size="sm"
              >
                Section Only
              </Button>
              <Button
                type="button"
                variant={transferMode === "class" ? "default" : "outline"}
                onClick={() => {
                  setTransferMode("class");
                  setSelectedSectionId("");
                }}
                size="sm"
              >
                Class + Section
              </Button>
            </div>
          </div>

          {/* Target Class Selection */}
          {transferMode === "class" && (
            <div className="space-y-2">
              <Label htmlFor="targetClass">Target Class</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class to transfer to" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Target Section Selection */}
          <div className="space-y-2">
            <Label htmlFor="targetSection">Target Section</Label>
            <Select
              value={selectedSectionId}
              onValueChange={setSelectedSectionId}
              disabled={transferMode === "class" && !selectedClassId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section to transfer to" />
              </SelectTrigger>
              <SelectContent>
                {transferMode === "class"
                  ? selectedClass?.sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name} ({section.currentEnrollment} students)
                      </SelectItem>
                    ))
                  : classes.map((cls) =>
                      cls.sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {cls.name} - {section.name} ({section.currentEnrollment} students)
                        </SelectItem>
                      ))
                    )}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Section Info */}
          {selectedSection && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedSection.name}</h3>
                  <p className="text-sm text-gray-600">
                    {transferMode === "class" ? selectedClass?.name : "Various classes"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {selectedSection.currentEnrollment}
                  </div>
                  <div className="text-sm text-gray-600">Current Students</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isTransferring}>
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!selectedSectionId || isTransferring || (transferMode === "class" && !selectedClassId)}
            >
              {isTransferring ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                `Transfer ${selectedStudents.length} Student(s)`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}