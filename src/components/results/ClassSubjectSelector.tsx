import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

interface ClassSubjectSelectorProps {
  academicYear: string;
  term: string;
  termId: string;
  classId: string;
  onAcademicYearChange: (value: string) => void;
  onTermChange: (value: string, termId: string) => void;
  onClassChange: (value: string) => void;
  onLoadStudents: () => void;
  onReset: () => void;
  academicYears: Array<any>;
  terms: Array<any>;
  classes: Array<any>;
  loading?: boolean;
}

export default function ClassSubjectSelector({
  academicYear,
  term,
  termId,
  classId,
  onAcademicYearChange,
  onTermChange,
  onClassChange,
  onLoadStudents,
  onReset,
  academicYears,
  terms,
  classes,
  loading = false,
}: ClassSubjectSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-4 items-end">
          <div className="space-y-2">
            <Label>Academic Year</Label>
            <Select value={academicYear} onValueChange={onAcademicYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.session || year.name || year.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Term</Label>
            <Select value={termId} onValueChange={(value) => {
              const selectedTerm = terms.find((t) => t.id === value);
              if (selectedTerm) {
                onTermChange(selectedTerm.term, selectedTerm.id);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.term ? t.term.replace("_", " ") : t.name || t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Class</Label>
            <Select value={classId} onValueChange={onClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name || cls.className || cls.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={onLoadStudents} disabled={loading}>
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Load Students
            </Button>
            <Button variant="outline" onClick={onReset}>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}