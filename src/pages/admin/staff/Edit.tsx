import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { staffApi } from "@/lib/api/staff";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffRole, StaffType, StaffStatus } from "@/lib/types/common";

const staffSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.nativeEnum(StaffRole),
  type: z.nativeEnum(StaffType),
  status: z.nativeEnum(StaffStatus),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function EditStaff() {
  const navigate = useNavigate();
  const { staffId } = useParams<{ staffId: string }>();

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => staffApi.getStaffById(staffId!),
    enabled: !!staffId,
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
  });

  useEffect(() => {
    if (staff?.data) {
      setValue("firstName", staff.data.firstName);
      setValue("lastName", staff.data.lastName);
      setValue("email", staff.data.email);
      setValue("phone", staff.data.phone);
      setValue("role", staff.data.role);
      setValue("type", staff.data.type);
      setValue("status", staff.data.status);
      setValue("dateOfBirth", staff.data.dateOfBirth?.split("T")[0] || "");
      setValue("address", staff.data.address || "");
    }
  }, [staff, setValue]);

  const updateStaffMutation = useMutation({
    mutationFn: (data: StaffFormData) => staffApi.updateStaff(staffId!, data),
    onSuccess: () => {
      toast.success("Staff updated successfully");
      navigate("/admin/staff");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update staff");
    },
  });

  const onSubmit = (data: StaffFormData) => {
    updateStaffMutation.mutate(data);
  };

  if (staffLoading) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-[1500px] space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/staff")}>
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Staff</h1>
              <p className="text-sm text-muted-foreground">Loading staff information...</p>
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

  if (!staff?.data) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-[1500px] space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/staff")}>
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Staff</h1>
              <p className="text-sm text-muted-foreground">Staff not found</p>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Staff not found</p>
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/staff")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Staff</h1>
            <p className="text-sm text-muted-foreground">
              {staff.data.firstName} {staff.data.lastName} ({staff.data.staffId})
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
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
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address")} />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEACHER">Teacher</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="HEAD_TEACHER">Head Teacher</SelectItem>
                            <SelectItem value="BURSARY">Bursary</SelectItem>
                            <SelectItem value="BURSAR">Bursar</SelectItem>
                            <SelectItem value="STOREKEEPER">Storekeeper</SelectItem>
                            <SelectItem value="SUPPORT">Support Staff</SelectItem>
                            <SelectItem value="CLASS_TEACHER">Class Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEACHING">Teaching</SelectItem>
                            <SelectItem value="NON_TEACHING">Non-Teaching</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/staff")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Staff"
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
