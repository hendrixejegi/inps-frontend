import { cn } from "@/lib/utils";

interface SchoolLogoProps {
  size?: "small" | "medium" | "large" | "custom";
  customSize?: string;
  variant?: "full" | "icon";
  className?: string;
  showBackground?: boolean;
  backgroundClassName?: string;
  forceWhiteBackground?: boolean;
}

const sizeClasses = {
  small: "h-6 w-6",
  medium: "h-10 w-10",
  large: "h-20 w-20",
  custom: "",
};

export function SchoolLogo({ size = "medium", customSize, variant = "full", className, showBackground = false, backgroundClassName, forceWhiteBackground = false }: SchoolLogoProps) {
  const logoSrc = variant === "icon" ? "/logo-icon.png" : "/logo.png";
  const sizeClass = size === "custom" ? customSize : sizeClasses[size];

  if (showBackground || forceWhiteBackground) {
    return (
      <div className={cn("grid place-items-center rounded-full shadow-sm", sizeClass, className, backgroundClassName, forceWhiteBackground && "bg-white")}>
        <img
          src={logoSrc}
          alt="INPS School Logo"
          className="object-contain p-1"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="INPS School Logo"
      className={cn(sizeClass, "object-contain", className)}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
}
