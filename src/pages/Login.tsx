import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, type UserType } from "@/contexts/auth-context";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.").min(6, "Password must contain at least 6 characters."),
  rememberMe: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [accountType, setAccountType] = useState<UserType>("staff");
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (accountType === "parent") {
        navigate("/parent/dashboard", { replace: true });
      } else {
        // Check if user has BURSARY role
        const user = localStorage.getItem("user_data");
        if (user) {
          const userData = JSON.parse(user);
          if (userData.user && "role" in userData.user && userData.user.role === "BURSARY") {
            navigate("/bursary/dashboard", { replace: true });
          } else {
            navigate("/admin/dashboard", { replace: true });
          }
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      }
    }
  }, [isAuthenticated, accountType, navigate]);

  const onSubmit = async (values: LoginValues) => {
    setSubmitError("");
    try {
      localStorage.setItem("remember_me", String(values.rememberMe));
      await login(values.email, values.password, accountType);
      
      if (accountType === "parent") {
        navigate("/parent/dashboard", { replace: true });
      } else {
        // Check if user has BURSARY role
        const user = localStorage.getItem("user_data");
        if (user) {
          const userData = JSON.parse(user);
          if (userData.user && "role" in userData.user && userData.user.role === "BURSARY") {
            navigate("/bursary/dashboard", { replace: true });
          } else {
            navigate("/admin/dashboard", { replace: true });
          }
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not sign you in. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.78fr)]">
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
        <a href="/" className="inline-flex w-fit items-center gap-3 rounded-xl" aria-label="INPS School Portal home">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-extrabold tracking-wide text-primary">INPS SCHOOL</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Management portal</span>
          </span>
        </a>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12 sm:py-16">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-accent">Secure access</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Welcome back</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Sign in to manage learning, records, and school operations.
            </p>
          </div>

          <Tabs
            value={accountType}
            onValueChange={(value) => {
              setAccountType(value as UserType);
              setSubmitError("");
            }}
            className="mb-7"
          >
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-secondary p-1.5">
              <TabsTrigger value="staff" className="h-9 rounded-lg font-semibold data-[state=active]:bg-card data-[state=active]:text-primary">Staff login</TabsTrigger>
              <TabsTrigger value="parent" className="h-9 rounded-lg font-semibold data-[state=active]:bg-card data-[state=active]:text-primary">Parent login</TabsTrigger>
            </TabsList>
          </Tabs>

          {submitError && (
            <Alert variant="destructive" className="mb-5 rounded-xl bg-destructive/5">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder={accountType === "staff" ? "name@inps.edu.ng" : "parent@example.com"}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-12 rounded-xl bg-card pl-11 text-base shadow-sm"
                  {...register("email")}
                />
              </div>
              {errors.email && <p id="email-error" className="text-sm font-medium text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="h-12 rounded-xl bg-card px-11 text-base shadow-sm"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="text-sm font-medium text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2.5">
              <Checkbox
                id="remember-me"
                checked={watch("rememberMe")}
                onCheckedChange={(checked) => setValue("rememberMe", checked === true)}
                className="rounded border-input data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
              />
              <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </Label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl font-semibold shadow-sm">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </section>
      
      {/* Right side - visible only on large screens */}
      <section className="hidden lg:flex relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50" />
        <div className="relative z-10 flex h-full flex-col justify-center px-12 text-center">
          <div className="grid size-20 place-items-center rounded-2xl bg-primary-foreground/10 text-primary-foreground mx-auto mb-8">
            <GraduationCap className="size-10" />
          </div>
          <h2 className="text-4xl font-extrabold text-primary-foreground mb-4">INPS School Portal</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Empowering education through technology. Manage students, staff, classes, and results all in one place.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <GraduationCap className="size-5" />
              <span>Comprehensive Student Management</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <LockKeyhole className="size-5" />
              <span>Secure & Reliable</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Mail className="size-5" />
              <span>Real-time Notifications</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
