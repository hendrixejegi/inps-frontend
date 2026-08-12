import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Gender, StudentStatus } from "@/lib/types/common";

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  status: z.nativeEnum(StudentStatus),
  newSection: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function EditStudent() {
  const navigate = useNavigate();
  const { admissionNumber } = useParams<{ admissionNumber: string }>();
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [transferMode, setTransferMode] = useState<"section" | "class">("section");

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["student", admissionNumber],
    queryFn: () => adminApi.getStudentByAdmissionNumber(admissionNumber!),
    enabled: !!admissionNumber,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: () => adminApi.getAllClassesWithSections(),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    if (student?.data) {
      setValue("firstName", student.data.firstName);
      setValue("lastName", student.data.lastName);
      setValue("gender", student.data.gender);
      setValue("dateOfBirth", student.data.dateOfBirth?.split("T")[0] || "");
      setValue("status", student.data.status);
    }
  }, [student, setValue]);

  const updateStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      return adminApi.updateStudent(admissionNumber!, {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        status: data.status,
      });
    },
    onSuccess: () => {
      toast.success("Student updated successfully");
      navigate("/admin/students");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update student");
    },
  });

  const onSubmit = (data: StudentFormData) => {
    updateStudentMutation.mutate(data);
  };

  const transferMutation = useMutation({
    mutationFn: ({ sectionId, classId }: { sectionId: string; classId?: string }) => {
      const enrollmentId = student.data.enrollments?.[0]?.id;
      if (!enrollmentId) {
        throw new Error("No active enrollment found for this student");
      }
      
      if (transferMode === "class" && classId) {
        return adminApi.transferStudentWithClass(enrollmentId, classId, sectionId);
      } else {
        return adminApi.transferStudent(enrollmentId, sectionId);
      }
    },
    onSuccess: () => {
      toast.success("Student transferred successfully");
      setShowTransfer(false);
      setSelectedSection("");
      setSelectedClass("");
      setTransferMode("section");
      // Refresh student data to show updated enrollment
      window.location.reload();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to transfer student");
    },
  });

  if (studentLoading) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-[1500px] space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/students")}>
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Student</h1>
              <p className="text-sm text-muted-foreground">Loading student information...</p>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!student?.data) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-[1500px] space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/students")}>
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Student</h1>
              <p className="text-sm text-muted-foreground">Student not found</p>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Student not found</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/students")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Student</h1>
            <p className="text-sm text-muted-foreground">
              {student.data.firstName} {student.data.lastName} ({student.data.admissionNumber})
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" {...register("firstName")} />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" {...register("lastName")} />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                    {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>
                            <SelectItem value={StudentStatus.GRADUATED}>Graduated</SelectItem>
                            <SelectItem value={StudentStatus.WITHDRAWN}>Withdrawn</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                  </div>
                </div>
              </div>

              {/* Transfer Section */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Transfer Student</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Current Class</Label>
                    <div className="text-sm bg-muted p-2 rounded">
                      {student.data.enrollments?.[0]?.class?.name || "Not enrolled"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Section</Label>
                    <div className="text-sm bg-muted p-2 rounded">
                      {student.data.enrollments?.[0]?.section?.name || "Not assigned"}
                    </div>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowTransfer(!showTransfer)}
                  className="gap-2"
                >
                  <ArrowRight className="size-4" />
                  {showTransfer ? "Cancel Transfer" : "Transfer Student"}
                </Button>

                {showTransfer && (
                  <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                    <div className="space-y-2">
                      <Label>Transfer Mode</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={transferMode === "section" ? "default" : "outline"}
                          onClick={() => setTransferMode("section")}
                          size="sm"
                        >
                          Section Only
                        </Button>
                        <Button
                          type="button"
                          variant={transferMode === "class" ? "default" : "outline"}
                          onClick={() => setTransferMode("class")}
                          size="sm"
                        >
                          Class + Section
                        </Button>
                      </div>
                    </div>

                    {transferMode === "class" && (
                      <div className="space-y-2">
                        <Label htmlFor="newClass">Select New Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class to transfer to" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes?.data?.map((cls: any) => (
                              <SelectItem 
                                key={cls.id} 
                                value={cls.id}
                                disabled={cls.id === student.data.enrollments?.[0]?.class?.id}
                              >
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="newSection">Select New Section</Label>
                      <Select 
                        value={selectedSection} 
                        onValueChange={setSelectedSection}
                        disabled={transferMode === "class" && !selectedClass}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select section to transfer to" />
                        </SelectTrigger>
                        <SelectContent>
                          {transferMode === "class" 
                            ? classes?.data?.find((cls: any) => cls.id === selectedClass)?.sections?.map((section: any) => (
                                <SelectItem 
                                  key={section.id} 
                                  value={section.id}
                                  disabled={section.id === student.data.enrollments?.[0]?.section?.id}
                                >
                                  {section.name}
                                </SelectItem>
                              ))
                            : classes?.data?.map((cls: any) => 
                                cls.sections?.map((section: any) => (
                                  <SelectItem 
                                    key={section.id} 
                                    value={section.id}
                                    disabled={section.id === student.data.enrollments?.[0]?.section?.id}
                                  >
                                    {cls.name} - {section.name}
                                  </SelectItem>
                                ))
                              )
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        onClick={() => {
                          setShowTransfer(false);
                          setSelectedSection("");
                          setSelectedClass("");
                          setTransferMode("section");
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        disabled={transferMutation.isPending || !selectedSection || (transferMode === "class" && !selectedClass)}
                        onClick={() => selectedSection && transferMutation.mutate({ 
                          sectionId: selectedSection, 
                          classId: transferMode === "class" ? selectedClass : undefined 
                        })}
                      >
                        {transferMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Transferring...
                          </>
                        ) : (
                          "Confirm Transfer"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/students")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Student"
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
