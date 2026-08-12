import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { staffApi } from "@/lib/api/staff";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { StaffRole, Gender } from "@/lib/types/common";

const staffSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.nativeEnum(StaffRole),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
}).refine((data) => {
  // Ensure required fields are present
  return !!data.firstName && !!data.lastName && !!data.email && !!data.phone && !!data.role;
}, {
  message: "All required fields must be filled",
  path: [], // This applies to the entire object
});

// Explicit type definition to match CreateStaffRequest
type StaffFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  gender?: Gender;
  dateOfBirth?: string;
  address?: string;
};

export default function AddStaff() {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      role: StaffRole.TEACHER,
      gender: Gender.MALE,
    },
  });

  const createStaffMutation = useMutation({
    mutationFn: (data: StaffFormData) => staffApi.createStaff(data),
    onSuccess: () => {
      toast.success("Staff account created successfully");
      navigate("/admin/staff");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create staff account");
    },
  });

  const onSubmit = (data: StaffFormData) => {
    createStaffMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/staff")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Staff</h1>
            <p className="text-sm text-muted-foreground">Create a new staff account</p>
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
                    <Label htmlFor="gender">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
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
                            <SelectItem value={StaffRole.TEACHER}>Teacher</SelectItem>
                            <SelectItem value={StaffRole.ADMIN}>Admin</SelectItem>
                            <SelectItem value={StaffRole.HEAD_TEACHER}>Head Teacher</SelectItem>
                            <SelectItem value={StaffRole.BURSARY}>Bursary</SelectItem>
                            <SelectItem value={StaffRole.BURSAR}>Bursar</SelectItem>
                            <SelectItem value={StaffRole.STOREKEEPER}>Storekeeper</SelectItem>
                            <SelectItem value={StaffRole.SUPPORT}>Support Staff</SelectItem>
                            <SelectItem value={StaffRole.CLASS_TEACHER}>Class Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
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
                      Creating...
                    </>
                  ) : (
                    "Create Staff Account"
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
