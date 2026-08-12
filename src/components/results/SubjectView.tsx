import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScoreEntrySheet from "./ScoreEntrySheet";

interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
  name?: string;
}

interface StudentScore {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  ca1Score: number | null;
  ca2Score: number | null;
  examScore: number | null;
  total: number;
  grade: string;
  isComplete: boolean;
}

interface SubjectViewProps {
  subjects: Subject[];
  selectedSubject: string;
  onSubjectChange: (subjectId: string) => void;
  students: StudentScore[];
  onScoreChange: (studentId: string, field: "ca1Score" | "ca2Score" | "examScore", value: number | null) => void;
  onRemarkChange: (remark: string) => void;
  subjectRemark: string;
  onPreviousSubject: () => void;
  onNextSubject: () => void;
  readOnly?: boolean;
}

export default function SubjectView({
  subjects,
  selectedSubject,
  onSubjectChange,
  students,
  onScoreChange,
  onRemarkChange,
  subjectRemark,
  onPreviousSubject,
  onNextSubject,
  readOnly = false,
}: SubjectViewProps) {
  const currentSubjectIndex = subjects.findIndex(s => s.id === selectedSubject);
  const currentSubject = subjects[currentSubjectIndex];

  return (
    <div className="space-y-4">
      {/* Subject Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={onSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.subjectName || subject.name} ({subject.subjectCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onPreviousSubject}
                disabled={currentSubjectIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={onNextSubject}
                disabled={currentSubjectIndex === subjects.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Entry Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentSubject?.subjectName} ({currentSubject?.subjectCode})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreEntrySheet
            students={students}
            onScoreChange={onScoreChange}
            showRemarks={false}
            readOnly={readOnly}
          />
        </CardContent>
      </Card>

      {/* Subject Teacher Remark */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Teacher Remark</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>General remarks for this subject</Label>
          <Textarea
            placeholder="Enter general remarks for this subject..."
            value={subjectRemark}
            onChange={(e) => onRemarkChange(e.target.value)}
            disabled={readOnly}
            className="min-h-[100px] mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}