import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

interface StatisticsCardsProps {
  totalStudents: number;
  totalResults: number;
  pendingVerification: number;
  completionPercentage: number;
}

export default function StatisticsCards({
  totalStudents,
  totalResults,
  pendingVerification,
  completionPercentage,
}: StatisticsCardsProps) {
  console.log("📊 [StatisticsCards] Component rendering with stats:", {
    totalStudents,
    totalResults,
    pendingVerification,
    completionPercentage
  });
  
  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Results Entered",
      value: totalResults,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Verification",
      value: pendingVerification,
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Completion Rate",
      value: `${completionPercentage}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}