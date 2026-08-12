import { ResultsSummary } from "@/lib/types/parent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Award, UsersRound } from "lucide-react";

interface ResultsSummaryProps {
  summary: ResultsSummary;
}

export function ResultsSummaryStats({ summary }: ResultsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalSubjects}</div>
          <p className="text-xs text-muted-foreground">Enrolled subjects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subjects Passed</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.subjectsPassed}/{summary.totalSubjects}</div>
          <p className="text-xs text-muted-foreground">
            {((summary.subjectsPassed / summary.totalSubjects) * 100).toFixed(0)}% pass rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.averageScore.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Overall average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Class Position</CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.overallPosition}</div>
          <p className="text-xs text-muted-foreground">Position in class</p>
        </CardContent>
      </Card>
    </div>
  );
}