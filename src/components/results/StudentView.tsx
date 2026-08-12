import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScoreEntrySheet from "./ScoreEntrySheet";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
}

interface SubjectScore {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  name?: string;
  ca1Score: number | null;
  ca2Score: number | null;
  examScore: number | null;
  total: number;
  grade: string;
  isComplete: boolean;
}

interface StudentViewProps {
  students: Student[];
  selectedStudent: string;
  onStudentChange: (studentId: string) => void;
  subjectScores: SubjectScore[];
  onScoreChange: (subjectId: string, field: "ca1Score" | "ca2Score" | "examScore", value: number | null) => void;
  overallPosition: number;
  totalStudents: number;
  classAverage: number;
  onPreviousStudent: () => void;
  onNextStudent: () => void;
  readOnly?: boolean;
}

export default function StudentView({
  students,
  selectedStudent,
  onStudentChange,
  subjectScores,
  onScoreChange,
  overallPosition,
  totalStudents,
  classAverage,
  onPreviousStudent,
  onNextStudent,
  readOnly = false,
}: StudentViewProps) {
  const currentStudentIndex = students.findIndex(s => s.id === selectedStudent);
  const currentStudent = students[currentStudentIndex];

  // Convert subject scores to student score format for ScoreEntrySheet
  const studentScoresForSheet = subjectScores.map((subject) => ({
    studentId: subject.subjectId,
    studentName: subject.subjectName || subject.name,
    admissionNumber: subject.subjectCode,
    ca1Score: subject.ca1Score,
    ca2Score: subject.ca2Score,
    examScore: subject.examScore,
    total: subject.total,
    grade: subject.grade,
    isComplete: subject.isComplete,
  }));

  return (
    <div className="space-y-4">
      {/* Student Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Student Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Student</Label>
              <Select value={selectedStudent} onValueChange={onStudentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onPreviousStudent}
                disabled={currentStudentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={onNextStudent}
                disabled={currentStudentIndex === students.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Student Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Overall Position</Label>
              <div className="text-2xl font-bold">
                {overallPosition}/{totalStudents}
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Class Average</Label>
              <div className="text-2xl font-bold">{classAverage}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Student</Label>
              <div className="text-lg font-medium">
                {currentStudent?.firstName} {currentStudent?.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentStudent?.admissionNumber}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Entry Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>All Subjects for {currentStudent?.firstName} {currentStudent?.lastName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreEntrySheet
            students={studentScoresForSheet}
            onScoreChange={(studentId, field, value) => onScoreChange(studentId, field, value)}
            showRemarks={false}
            readOnly={readOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
}