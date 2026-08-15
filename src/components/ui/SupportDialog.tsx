import { Phone, Mail, MapPin, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const [copied, setCopied] = useState<"phone" | "email" | null>(null);

  const copyToClipboard = (text: string, type: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact Support</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* School Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">International Nursery and Primary School</h3>
            <p className="text-sm text-muted-foreground">
              Trans-Ekulu Enugu
            </p>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a 
                  href="tel:+2348152622017" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +234 815 262 2017
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard("+2348152622017", "phone")}
              className="shrink-0"
            >
              {copied === "phone" ? (
                <Check className="size-4 text-green-600" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <a 
                  href="mailto:echika911@gmail.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  echika911@gmail.com
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard("echika911@gmail.com", "email")}
              className="shrink-0"
            >
              {copied === "email" ? (
                <Check className="size-4 text-green-600" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          {/* Technical Support */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <span className="font-semibold text-primary">Saint Tech Concept</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
