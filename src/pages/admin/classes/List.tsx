import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, Users, ChevronRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import AdvancedSearch, { FilterConfig, SearchFilters } from "@/components/admin/AdvancedSearch";

export default function ClassesList() {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  // Filter configuration for classes
  const filterConfig: FilterConfig[] = [
    {
      field: 'status',
      type: 'chip',
      label: 'Status',
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
      ]
    },
    {
      field: 'level',
      type: 'select',
      label: 'Level',
      options: [
        { value: 'PRIMARY', label: 'Primary' },
        { value: 'SECONDARY', label: 'Secondary' },
        { value: 'KINDERGARTEN', label: 'Kindergarten' },
      ]
    },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ["classes", searchFilters, isSearching],
    queryFn: () => {
      console.log('[DEBUG ClassesList] Starting query with filters:', searchFilters);
      
      // Use search endpoint if there's a search query
      if (searchFilters.q && searchFilters.q.trim()) {
        console.log('[DEBUG ClassesList] Using search endpoint');
        setIsSearching(true);
        const result = adminApi.searchClasses({
          q: searchFilters.q,
          status: searchFilters.status,
          level: searchFilters.level
        });
        console.log('[DEBUG ClassesList] Search result:', result);
        return result;
      }

      // Otherwise use regular getAllClasses
      console.log('[DEBUG ClassesList] Using getAllClasses endpoint');
      setIsSearching(false);
      const result = adminApi.getAllClasses({
        status: searchFilters.status,
        level: searchFilters.level
      });
      console.log('[DEBUG ClassesList] getAllClasses result:', result);
      return result;
    },
  });

  // Log class data structure when it arrives
  if (data?.data && data.data.length > 0) {
    console.log('[DEBUG ClassesList] Class data structure sample:', data.data[0]);
    console.log('[DEBUG ClassesList] Checking for student count fields:', {
      currentEnrollment: data.data[0].currentEnrollment,
      totalStudents: data.data[0].totalStudents,
      studentCount: data.data[0].studentCount,
      students: data.data[0].students,
      _count: data.data[0]._count
    });
  }

  const classes = data?.data || data || [];

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleClear = () => {
    setSearchFilters({});
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
            <p className="text-sm text-muted-foreground">Manage class sections and student assignments</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/admin/classes/add")}>
            <Plus className="size-4" /> Add Class
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>All Classes</CardTitle>
            </div>
            <AdvancedSearch
              onSearch={handleSearch}
              onClear={handleClear}
              filterConfig={filterConfig}
              initialFilters={searchFilters}
              showHistory={true}
            />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Failed to load classes. Please try again.
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No classes found
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                  <Card
                    key={cls.id}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{cls.className || cls.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{cls.level}</p>
                        </div>
                        <Badge variant={cls.status === "ACTIVE" ? "default" : "secondary"}>
                          {cls.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Students</span>
                          <span className="font-medium">
                            {cls._count?.enrollments || cls.currentEnrollment || 0}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-between"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/classes/${cls.id}`);
                          }}
                        >
                          View Details
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
