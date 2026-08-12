import { SubjectResult } from "@/lib/types/parent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsTableProps {
  results: SubjectResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">CA1</TableHead>
                <TableHead className="text-center">CA2</TableHead>
                <TableHead className="text-center">Exam</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-center">Position</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.subject.subjectName}</TableCell>
                  <TableCell className="text-center">{result.scores.ca1}</TableCell>
                  <TableCell className="text-center">{result.scores.ca2}</TableCell>
                  <TableCell className="text-center">{result.scores.exam}</TableCell>
                  <TableCell className="text-center font-semibold">{result.scores.total}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      result.scores.grade === 'A' ? 'bg-green-100 text-green-800' :
                      result.scores.grade === 'C' ? 'bg-blue-100 text-blue-800' :
                      result.scores.grade === 'D' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.scores.grade}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{result.position || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {result.subjectTeacherRemark || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}