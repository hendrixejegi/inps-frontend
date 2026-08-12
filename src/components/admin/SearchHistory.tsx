import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Clock } from "lucide-react";

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  maxItems?: number;
}

export default function SearchHistory({ onSelect, maxItems = 10 }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  const handleClear = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleRemove = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h !== query);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  if (history.length === 0) {
    return null;
  }

  const displayHistory = history.slice(0, maxItems);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span>Recent searches</span>
        </div>
        <button
          onClick={handleClear}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayHistory.map((query, index) => (
          <Badge
            key={index}
            variant="outline"
            className="cursor-pointer group hover:bg-accent"
            onClick={() => onSelect(query)}
          >
            <span className="mr-2">{query}</span>
            <button
              onClick={(e) => handleRemove(query, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
