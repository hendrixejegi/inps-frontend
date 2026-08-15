import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Plus, 
  ChevronRight, 
  Calendar, 
  Trash2, 
  Edit, 
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AcademicYearsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => adminApi.getAllSessions(),
  });

  const { data: currentSession, error: currentSessionError } = useQuery({
    queryKey: ["currentSession"],
    queryFn: () => adminApi.getCurrentSession(),
    retry: false,
  });

  const { data: currentTerm, error: currentTermError } = useQuery({
    queryKey: ["currentTerm"],
    queryFn: () => adminApi.getCurrentTerm(),
    retry: false,
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => adminApi.deleteSession(sessionId),
    onSuccess: () => {
      toast.success("Session deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete session");
    },
  });

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteSessionMutation.mutate(sessionToDelete);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CURRENT":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="size-3" />
            Current
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="size-3" />
            Completed
          </Badge>
        );
      case "UPCOMING":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="size-3" />
            Upcoming
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isCurrentSession = (sessionId: string) => {
    return currentSession?.data?.id === sessionId;
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Academic Years</h1>
            <p className="text-sm text-muted-foreground">Manage academic sessions and terms</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/admin/academic-years/add")}>
            <Plus className="size-4" /> Add Session
          </Button>
        </div>

        {/* Current Session/Term Indicator */}
        {(currentSession?.data && !currentSessionError) || (currentTerm?.data && !currentTermError) ? (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="size-5" />
                Current Academic Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 md:flex-row md:gap-6">
                {currentSession?.data && !currentSessionError && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Session:</span>
                    <Badge variant="default" className="font-medium">
                      {currentSession.data.session}
                    </Badge>
                  </div>
                )}
                {currentTerm?.data && !currentTermError && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Term:</span>
                    <Badge variant="default" className="font-medium">
                      {currentTerm.data.term.replace("_", " ")}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Failed to load sessions. Please try again.
              </div>
            ) : !sessions?.data || sessions.data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No sessions found. Create your first academic session to get started.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.data.map((session) => (
                  <Card
                    key={session.id}
                    className="transition-all hover:shadow-md hover:border-primary/50"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{session.session}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(session.status)}
                            {isCurrentSession(session.id) && (
                              <Badge variant="default" className="gap-1 bg-green-600">
                                <CheckCircle className="size-3" />
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Terms</span>
                          <span className="font-medium">
                            {session.terms?.length || 0}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => navigate(`/admin/academic-years/${session.id}`)}
                          >
                            <ChevronRight className="size-4 mr-1" />
                            View
                          </Button>
                          {!isCurrentSession(session.id) && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => navigate(`/admin/academic-years/${session.id}/edit`)}
                              >
                                <Edit className="size-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteSession(session.id)}
                                disabled={deleteSessionMutation.isPending}
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone and may affect related data like enrollments, results, and financial records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSessionMutation.isPending}
            >
              {deleteSessionMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}