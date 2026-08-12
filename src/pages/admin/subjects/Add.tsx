import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { SchoolLevel, CreateSubjectRequest } from "@/lib/types/common";

const subjectSchema = z.object({
  subjectName: z.string().min(1, "Subject name is required"),
  subjectCode: z.string().min(1, "Subject code is required").max(20, "Subject code must be 20 characters or less"),
  description: z.string().optional(),
  levels: z.array(z.nativeEnum(SchoolLevel)).min(1, "At least one level must be selected"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

const ALL_LEVELS = [
  SchoolLevel.DAYCARE,
  SchoolLevel.PRENURSERY,
  SchoolLevel.NURSERY_1,
  SchoolLevel.NURSERY_2,
  SchoolLevel.NURSERY_3,
  SchoolLevel.PRIMARY_1,
  SchoolLevel.PRIMARY_2,
  SchoolLevel.PRIMARY_3,
  SchoolLevel.PRIMARY_4,
  SchoolLevel.PRIMARY_5,
  SchoolLevel.PRIMARY_6,
];

const LEVEL_LABELS: Record<SchoolLevel, string> = {
  [SchoolLevel.DAYCARE]: "Daycare",
  [SchoolLevel.PRENURSERY]: "Pre-Nursery",
  [SchoolLevel.NURSERY_1]: "Nursery 1",
  [SchoolLevel.NURSERY_2]: "Nursery 2",
  [SchoolLevel.NURSERY_3]: "Nursery 3",
  [SchoolLevel.PRIMARY_1]: "Primary 1",
  [SchoolLevel.PRIMARY_2]: "Primary 2",
  [SchoolLevel.PRIMARY_3]: "Primary 3",
  [SchoolLevel.PRIMARY_4]: "Primary 4",
  [SchoolLevel.PRIMARY_5]: "Primary 5",
  [SchoolLevel.PRIMARY_6]: "Primary 6",
};

export default function AddSubject() {
  const navigate = useNavigate();

  console.log('[DEBUG AddSubject] Component mounted');

  // Fetch existing subjects
  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => adminApi.getAllSubjects(),
  });

  console.log('[DEBUG AddSubject] Subjects data:', subjectsData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      levels: [],
    },
  });

  console.log('[DEBUG AddSubject] Form initialized');

  const selectedLevels = watch("levels");

  console.log('[DEBUG AddSubject] Selected levels:', selectedLevels);

  const handleSelectExistingSubject = (subjectId: string) => {
    console.log('[DEBUG AddSubject] Selected existing subject:', subjectId);
    const subject = subjectsData?.data?.find((s: any) => s.id === subjectId);
    if (subject) {
      console.log('[DEBUG AddSubject] Populating form with subject data:', subject);
      setValue("subjectName", subject.subjectName);
      setValue("subjectCode", subject.subjectCode);
      setValue("description", subject.description || "");
      const levels = subject.levels?.map((l: any) => 
        typeof l === 'string' ? l : l.level
      ) || [];
      setValue("levels", levels);
    }
  };

  const toggleLevel = (level: SchoolLevel) => {
    console.log('[DEBUG AddSubject] Toggling level:', level);
    const currentLevels = selectedLevels || [];
    if (currentLevels.includes(level)) {
      setValue("levels", currentLevels.filter((l) => l !== level));
    } else {
      setValue("levels", [...currentLevels, level]);
    }
  };

  const selectAllLevels = () => {
    setValue("levels", ALL_LEVELS);
  };

  const clearAllLevels = () => {
    setValue("levels", []);
  };

  const createSubjectMutation = useMutation({
    mutationFn: (data: CreateSubjectRequest) => adminApi.createSubject(data),
    onSuccess: () => {
      toast.success("Subject created successfully");
      navigate("/admin/subjects");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create subject");
    },
  });

  const onSubmit = (data: SubjectFormData) => {
    console.log('[DEBUG AddSubject] Form submitted with data:', data);
    const createData: CreateSubjectRequest = {
      subjectName: data.subjectName,
      subjectCode: data.subjectCode,
      description: data.description,
      levels: data.levels,
    };
    console.log('[DEBUG AddSubject] Creating subject with:', createData);
    createSubjectMutation.mutate(createData);
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/subjects")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Subject</h1>
            <p className="text-sm text-muted-foreground">Create a new subject for the curriculum</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="existingSubject">Or Select Existing Subject</Label>
                  <Select onValueChange={handleSelectExistingSubject}>
                    <SelectTrigger id="existingSubject">
                      <SelectValue placeholder="Select an existing subject to edit or leave blank to create new" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Loading subjects...
                        </div>
                      ) : subjectsData?.data && subjectsData.data.length > 0 ? (
                        subjectsData.data.map((subject: any) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.subjectName} ({subject.subjectCode})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          No existing subjects
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Selecting a subject will populate the form. You can then modify and save as a new subject.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectName">Subject Name *</Label>
                  <Input
                    id="subjectName"
                    {...register("subjectName")}
                    placeholder="e.g., Mathematics"
                  />
                  {errors.subjectName && (
                    <p className="text-sm text-destructive">{errors.subjectName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectCode">Subject Code *</Label>
                  <Input
                    id="subjectCode"
                    {...register("subjectCode")}
                    placeholder="e.g., MATH"
                    className="uppercase"
                  />
                  {errors.subjectCode && (
                    <p className="text-sm text-destructive">{errors.subjectCode.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    A short code for the subject (e.g., MATH, ENG, SCI)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Brief description of the subject"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Applicable Levels *</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllLevels}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearAllLevels}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {ALL_LEVELS.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${level}`}
                          checked={selectedLevels?.includes(level)}
                          onCheckedChange={() => toggleLevel(level)}
                        />
                        <Label
                          htmlFor={`level-${level}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {LEVEL_LABELS[level]}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.levels && (
                    <p className="text-sm text-destructive">{errors.levels.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/subjects")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Subject"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
