import { Button } from "@/components/ui/button";
import { Grid3x3, BookOpen, User } from "lucide-react";

type EntryMode = "matrix" | "subject" | "student";

interface ModeSwitcherProps {
  currentMode: EntryMode;
  onModeChange: (mode: EntryMode) => void;
}

export default function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  const modes = [
    {
      id: "matrix" as EntryMode,
      label: "Matrix View",
      description: "All students × All subjects",
      icon: Grid3x3,
    },
    {
      id: "subject" as EntryMode,
      label: "By Subject",
      description: "One subject, all students",
      icon: BookOpen,
    },
    {
      id: "student" as EntryMode,
      label: "By Student",
      description: "One student, all subjects",
      icon: User,
    },
  ];

  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <Button
            key={mode.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(mode.id)}
            className="flex-1 justify-start gap-2"
          >
            <Icon className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="font-medium">{mode.label}</span>
              <span className="text-xs opacity-70">{mode.description}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

export type { EntryMode };