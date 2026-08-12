import { useState, useEffect, useRef } from "react";
import React from "react";
import { Search, X, Users, User, BookOpen, Layers, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api/admin";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  subjectName?: string;
  subjectCode?: string;
  staffId?: string;
  admissionNumber?: string;
  role?: string;
  status?: string;
  type?: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "students" | "staff" | "parents" | "classes" | "subjects">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await adminApi.search(searchQuery);
      setResults(data.data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (type: string, id: string) => {
    handleClose();
    
    const routes: Record<string, string> = {
      students: `/admin/students/${id}`,
      staff: `/admin/staff/${id}`,
      parents: `/admin/parents/${id}`,
      classes: `/admin/classes/${id}`,
      subjects: `/admin/subjects/${id}`,
    };
    
    navigate(routes[type] || "/");
  };

  const getIcon = (type: string) => {
    const icons: Record<string, any> = {
      students: Users,
      staff: User,
      parents: User,
      classes: Layers,
      subjects: BookOpen,
      results: FileText,
    };
    return icons[type] || Search;
  };

  const getResultsByType = (type: string) => {
    if (!results) return [];
    return results[type] || [];
  };

  const totalResults = results ? Object.values(results).flat().length : 0;

  if (!isOpen) {
    return (
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search students, staff, records... (Ctrl+K)"
          aria-label="Global search"
          className="h-11 rounded-xl border-transparent bg-muted pl-10 focus-visible:bg-card"
          onClick={() => setIsOpen(true)}
          readOnly
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card rounded-xl shadow-2xl border">
        <div className="flex items-center gap-2 p-4 border-b">
          <Search className="size-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search students, staff, parents, classes, subjects..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 text-lg"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 border-b overflow-x-auto">
          {["all", "students", "staff", "parents", "classes", "subjects"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[500px] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : query.length < 2 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Type at least 2 characters to search</p>
              <p className="text-sm mt-2">Press Esc to close</p>
            </div>
          ) : !results || totalResults === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-2">Try different keywords</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === "all" ? (
                // Show all categories
                Object.entries(results).map(([type, items]: [string, any]) => {
                  if (!items || items.length === 0) return null;
                  const Icon = getIcon(type);
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <h3 className="font-semibold capitalize">{type}</h3>
                        <Badge variant="secondary">{items.length}</Badge>
                      </div>
                      <div className="space-y-1">
                        {items.slice(0, 3).map((item: SearchResult) => (
                          <button
                            key={item.id}
                            onClick={() => handleResultClick(type, item.id)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {item.name || `${item.firstName} ${item.lastName}` || item.subjectName}
                              </span>
                              {item.staffId && (
                                <span className="text-sm text-muted-foreground">{item.staffId}</span>
                              )}
                              {item.admissionNumber && (
                                <span className="text-sm text-muted-foreground">{item.admissionNumber}</span>
                              )}
                              {item.subjectCode && (
                                <span className="text-sm text-muted-foreground">{item.subjectCode}</span>
                              )}
                            </div>
                          </button>
                        ))}
                        {items.length > 3 && (
                          <p className="text-sm text-muted-foreground pl-3">
                            +{items.length - 3} more results
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Show single category
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-muted-foreground">
                      {React.createElement(getIcon(activeTab), { className: "size-4" })}
                    </span>
                    <h3 className="font-semibold capitalize">{activeTab}</h3>
                    <Badge variant="secondary">{getResultsByType(activeTab).length}</Badge>
                  </div>
                  <div className="space-y-1">
                    {getResultsByType(activeTab).map((item: SearchResult) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(activeTab, item.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {item.name || `${item.firstName} ${item.lastName}` || item.subjectName}
                          </span>
                          {item.staffId && (
                            <span className="text-sm text-muted-foreground">{item.staffId}</span>
                          )}
                          {item.admissionNumber && (
                            <span className="text-sm text-muted-foreground">{item.admissionNumber}</span>
                          )}
                          {item.subjectCode && (
                            <span className="text-sm text-muted-foreground">{item.subjectCode}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t text-sm text-muted-foreground">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          {totalResults > 0 && (
            <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
}
