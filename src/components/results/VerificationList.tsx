import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, User, BookOpen, Award } from "lucide-react";

interface VerificationListProps {
  results: any[];
  selectedResults: Set<string>;
  onSelectResult: (resultId: string) => void;
  onVerifyResult: (resultId: string) => void;
}

export default function VerificationList({
  results,
  selectedResults,
  onSelectResult,
  onVerifyResult,
}: VerificationListProps) {
  return (
    <div className="space-y-4">
      {results.map((result: any) => (
        <Card key={result.id} className="p-4">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={selectedResults.has(result.id)}
              onCheckedChange={() => onSelectResult(result.id)}
              className="mt-1"
            />
            
            <div className="flex-1 space-y-3">
              {/* Student Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {result.student?.firstName} {result.student?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.student?.admissionNumber}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Class {result.class?.name}</Badge>
              </div>

              {/* Subject Info */}
              <div className="flex items-center gap-3 pl-13">
                <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{result.subject?.subjectName}</p>
                  <p className="text-sm text-gray-600">{result.subject?.subjectCode}</p>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-4 gap-4 pl-13">
                <div>
                  <p className="text-xs text-gray-600 mb-1">CA1 Score</p>
                  <p className="font-semibold text-gray-900">{result.ca1Score ?? '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">CA2 Score</p>
                  <p className="font-semibold text-gray-900">{result.ca2Score ?? '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Exam Score</p>
                  <p className="font-semibold text-gray-900">{result.examScore ?? '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total / Grade</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{result.total ?? '-'}</p>
                    <Badge variant={result.grade?.includes('A') || result.grade?.includes('B') ? 'default' : 'secondary'}>
                      {result.grade ?? '-'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pl-13">
                <Button
                  size="sm"
                  onClick={() => onVerifyResult(result.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
