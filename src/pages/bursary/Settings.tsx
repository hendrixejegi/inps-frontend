import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BursaryLayout } from "@/components/layout/BursaryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BursarySettings() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Financial Configuration
  const [defaultAcademicYear, setDefaultAcademicYear] = useState("");
  const [defaultTerm, setDefaultTerm] = useState("");
  const [lateFeePercentage, setLateFeePercentage] = useState("10");
  const [lateFeeGraceDays, setLateFeeGraceDays] = useState("7");
  const [defaultPaymentMethods, setDefaultPaymentMethods] = useState("CASH,BANK_TRANSFER");

  // Fee Structure Defaults
  const [tuitionFee, setTuitionFee] = useState("");
  const [developmentFee, setDevelopmentFee] = useState("");
  const [sportsFee, setSportsFee] = useState("");
  const [libraryFee, setLibraryFee] = useState("");

  const handleSave = () => {
    setIsLoading(true);
    setSaveSuccess(false);

    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleReset = () => {
    setDefaultAcademicYear("");
    setDefaultTerm("");
    setLateFeePercentage("10");
    setLateFeeGraceDays("7");
    setDefaultPaymentMethods("CASH,BANK_TRANSFER");
    setTuitionFee("");
    setDevelopmentFee("");
    setSportsFee("");
    setLibraryFee("");
  };

  return (
    <BursaryLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/bursary/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bursary Settings</h1>
            <p className="text-muted-foreground mt-1">Configure financial management settings</p>
          </div>
        </div>

        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Academic Year Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Year Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultAcademicYear">Default Academic Year</Label>
                <Input
                  id="defaultAcademicYear"
                  placeholder="e.g., 2024/2025"
                  value={defaultAcademicYear}
                  onChange={(e) => setDefaultAcademicYear(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultTerm">Default Term</Label>
                <Select value={defaultTerm} onValueChange={setDefaultTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST_TERM">First Term</SelectItem>
                    <SelectItem value="SECOND_TERM">Second Term</SelectItem>
                    <SelectItem value="THIRD_TERM">Third Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Late Fee Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Late Fee Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lateFeePercentage">Late Fee Percentage (%)</Label>
                <Input
                  id="lateFeePercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={lateFeePercentage}
                  onChange={(e) => setLateFeePercentage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lateFeeGraceDays">Grace Period (Days)</Label>
                <Input
                  id="lateFeeGraceDays"
                  type="number"
                  min="0"
                  value={lateFeeGraceDays}
                  onChange={(e) => setLateFeeGraceDays(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPaymentMethods">Default Payment Methods</Label>
                <Textarea
                  id="defaultPaymentMethods"
                  placeholder="CASH,BANK_TRANSFER,PAYSTACK"
                  value={defaultPaymentMethods}
                  onChange={(e) => setDefaultPaymentMethods(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Comma-separated list of payment methods</p>
              </div>
              <div className="space-y-2">
                <Label>Accepted Payment Methods</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span>Cash Payments</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span>Paystack</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>POS</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Structure Defaults */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure Defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tuitionFee">Default Tuition Fee (₦)</Label>
                <Input
                  id="tuitionFee"
                  type="number"
                  placeholder="e.g., 45000"
                  value={tuitionFee}
                  onChange={(e) => setTuitionFee(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developmentFee">Default Development Fee (₦)</Label>
                <Input
                  id="developmentFee"
                  type="number"
                  placeholder="e.g., 15000"
                  value={developmentFee}
                  onChange={(e) => setDevelopmentFee(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sportsFee">Default Sports Fee (₦)</Label>
                <Input
                  id="sportsFee"
                  type="number"
                  placeholder="e.g., 5000"
                  value={sportsFee}
                  onChange={(e) => setSportsFee(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="libraryFee">Default Library Fee (₦)</Label>
                <Input
                  id="libraryFee"
                  type="number"
                  placeholder="e.g., 3000"
                  value={libraryFee}
                  onChange={(e) => setLibraryFee(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </BursaryLayout>
  );
}
