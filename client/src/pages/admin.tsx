import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  LayoutDashboard,
  LogOut,
  Loader2,
  FileText,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { GroupedSubmissions, Submission } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import landingImage from "@assets/image_1766928192688.png";

const ADMIN_TOKEN_KEY = "admin_token";

function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers: HeadersInit = {
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)["x-admin-token"] = token;
  }
  return fetch(url, { ...options, headers });
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

function PendingApprovalCard({
  submission,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  submission: Submission;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  return (
    <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300">
                <Clock className="w-3 h-3 mr-1" />
                Pending Approval
              </Badge>
              <span className="font-semibold" data-testid={`pending-name-${submission.id}`}>{submission.name}</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium">Phone:</span> {submission.phoneNumber}</p>
              <p><span className="font-medium">Gender:</span> {submission.gender || "N/A"}</p>
              <p><span className="font-medium">Date of Birth:</span> {submission.dateOfBirth ? new Date(submission.dateOfBirth).toLocaleDateString() : "N/A"}</p>
              <p><span className="font-medium">Present Address:</span> {submission.presentAddress || "N/A"}</p>
              <p><span className="font-medium">Native Place:</span> {submission.nativePlace || "N/A"}</p>
              <p><span className="font-medium">Gothram:</span> {submission.gothram} {submission.otherGothram && `(${submission.otherGothram})`}</p>
              <p><span className="font-medium">House Name:</span> {submission.houseName} {submission.otherHouseName && `(${submission.otherHouseName})`}</p>
              <p><span className="font-medium">Location:</span> {submission.state}, {submission.county}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={() => onApprove(submission.id)}
              disabled={isApproving || isRejecting}
              className="gap-2"
              data-testid={`button-approve-${submission.id}`}
            >
              {isApproving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Approve
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isApproving || isRejecting}
                  className="gap-2"
                  data-testid={`button-reject-${submission.id}`}
                >
                  {isRejecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this submission from <strong>{submission.name}</strong>? This action cannot be undone and the submission will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onReject(submission.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    data-testid={`button-confirm-reject-${submission.id}`}
                  >
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  testId,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  testId: string;
}) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          data-testid={testId}
        >
          <span className="truncate">
            {selected.length === 0
              ? `All ${label}`
              : selected.length === 1
              ? selected[0]
              : `${selected.length} selected`}
          </span>
          <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex items-center justify-between gap-2 p-2 border-b">
          <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs">
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
            Clear
          </Button>
        </div>
        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={() => toggleOption(option)}
              />
              <span className="text-sm truncate">{option}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="p-2 rounded-md bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionGroup({ group }: { group: GroupedSubmissions }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover-elevate">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle className="text-lg font-semibold" data-testid={`group-title-${group.gothram.toLowerCase().replace(/\s+/g, "-")}`}>
                  {group.gothram}
                </CardTitle>
                <Badge variant="secondary" className="text-xs" data-testid={`badge-count-${group.gothram.toLowerCase().replace(/\s+/g, "-")}`}>
                  {group.count} {group.count === 1 ? "submission" : "submissions"}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" data-testid={`button-toggle-${group.gothram.toLowerCase().replace(/\s+/g, "-")}`}>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {group.submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">Name</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">Phone</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">Gender</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">DOB</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">Present Address</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">Native Place</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">House Name</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">State</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">County</TableHead>
                      {group.gothram === "Other" && (
                        <TableHead className="text-xs font-medium uppercase tracking-wide">Details</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.submissions.map((submission: Submission) => (
                      <TableRow key={submission.id} className="hover-elevate" data-testid={`row-submission-${submission.id}`}>
                        <TableCell className="font-medium" data-testid={`cell-name-${submission.id}`}>
                          {submission.name}
                        </TableCell>
                        <TableCell data-testid={`cell-phone-${submission.id}`}>
                          {submission.phoneNumber}
                        </TableCell>
                        <TableCell data-testid={`cell-gender-${submission.id}`}>
                          {submission.gender || "N/A"}
                        </TableCell>
                        <TableCell data-testid={`cell-dob-${submission.id}`}>
                          {submission.dateOfBirth ? new Date(submission.dateOfBirth).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell data-testid={`cell-address-${submission.id}`} className="max-w-xs truncate" title={submission.presentAddress || ""}>
                          {submission.presentAddress || "N/A"}
                        </TableCell>
                        <TableCell data-testid={`cell-native-${submission.id}`}>
                          {submission.nativePlace || "N/A"}
                        </TableCell>
                        <TableCell data-testid={`cell-housename-${submission.id}`}>
                          {submission.houseName}
                          {submission.houseName === "Other" && submission.otherHouseName && ` (${submission.otherHouseName})`}
                        </TableCell>
                        <TableCell data-testid={`cell-state-${submission.id}`}>
                          {submission.state}
                        </TableCell>
                        <TableCell data-testid={`cell-county-${submission.id}`}>
                          {submission.county}
                        </TableCell>
                        {group.gothram === "Other" && (
                          <TableCell data-testid={`cell-other-${submission.id}`}>
                            {submission.otherGothram && `Gothram: ${submission.otherGothram}`}
                            {submission.otherHouseName && `, House: ${submission.otherHouseName}`}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <Skeleton className="w-10 h-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        throw new Error("Invalid password");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.token) {
        setAdminToken(data.token);
      }
      toast({
        title: "Welcome!",
        description: "Successfully logged in to admin dashboard.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Invalid Password",
        description: "Please check your password and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      loginMutation.mutate(password);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter the admin password to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-admin-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending || !password.trim()}
              data-testid="button-login"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchName, setSearchName] = useState("");
  const [filterGothrams, setFilterGothrams] = useState<string[]>([]);
  const [filterHouseNames, setFilterHouseNames] = useState<string[]>([]);
  const [filterGenders, setFilterGenders] = useState<string[]>([]);
  const [filterStates, setFilterStates] = useState<string[]>([]);
  const [filterCountries, setFilterCountries] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      adminFetch("/api/admin/status")
        .then((res) => res.json())
        .then((data) => setIsAuthenticated(data.isAuthenticated))
        .catch(() => setIsAuthenticated(false));
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/logout", { method: "POST" });
      return res.json();
    },
    onSuccess: () => {
      clearAdminToken();
      setIsAuthenticated(false);
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/grouped"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
  });

  const {
    data: groupedData,
    isLoading: dataLoading,
    error,
  } = useQuery<GroupedSubmissions[]>({
    queryKey: ["/api/submissions/grouped"],
    queryFn: async () => {
      const res = await adminFetch("/api/submissions/grouped");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: isAuthenticated === true,
  });

  const {
    data: pendingData,
    isLoading: pendingLoading,
  } = useQuery<Submission[]>({
    queryKey: ["/api/submissions/pending"],
    queryFn: async () => {
      const res = await adminFetch("/api/submissions/pending");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: isAuthenticated === true,
  });

  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      setApprovingId(id);
      const res = await adminFetch(`/api/submissions/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/grouped"] });
      toast({
        title: "Approved!",
        description: "Submission has been approved and added to the database.",
      });
      setApprovingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve submission. Please try again.",
        variant: "destructive",
      });
      setApprovingId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      setRejectingId(id);
      const res = await adminFetch(`/api/submissions/${id}/reject`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/pending"] });
      toast({
        title: "Rejected",
        description: "Submission has been rejected and removed.",
      });
      setRejectingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject submission. Please try again.",
        variant: "destructive",
      });
      setRejectingId(null);
    },
  });

  const filterOptions = useMemo(() => {
    if (!groupedData) return { gothrams: [], houseNames: [], genders: [], states: [], countries: [] };
    
    const gothrams = new Set<string>();
    const houseNames = new Set<string>();
    const genders = new Set<string>();
    const states = new Set<string>();
    const countries = new Set<string>();
    
    groupedData.forEach((group) => {
      gothrams.add(group.gothram);
      group.submissions.forEach((sub) => {
        if (sub.houseName) houseNames.add(sub.houseName);
        if (sub.gender) genders.add(sub.gender);
        if (sub.state) states.add(sub.state);
        if (sub.county) countries.add(sub.county);
      });
    });
    
    return {
      gothrams: Array.from(gothrams).sort(),
      houseNames: Array.from(houseNames).sort(),
      genders: Array.from(genders).sort(),
      states: Array.from(states).sort(),
      countries: Array.from(countries).sort(),
    };
  }, [groupedData]);

  const filteredData = useMemo(() => {
    if (!groupedData) return [];
    
    return groupedData
      .filter((group) => filterGothrams.length === 0 || filterGothrams.includes(group.gothram))
      .map((group) => ({
        ...group,
        submissions: group.submissions.filter((sub) => {
          const matchesName = searchName === "" || 
            sub.name.toLowerCase().includes(searchName.toLowerCase());
          const matchesHouseName = filterHouseNames.length === 0 || filterHouseNames.includes(sub.houseName);
          const matchesGender = filterGenders.length === 0 || (sub.gender && filterGenders.includes(sub.gender));
          const matchesState = filterStates.length === 0 || filterStates.includes(sub.state);
          const matchesCountry = filterCountries.length === 0 || filterCountries.includes(sub.county);
          return matchesName && matchesHouseName && matchesGender && matchesState && matchesCountry;
        }),
      }))
      .map((group) => ({
        ...group,
        count: group.submissions.length,
      }))
      .filter((group) => group.submissions.length > 0);
  }, [groupedData, searchName, filterGothrams, filterHouseNames, filterGenders, filterStates, filterCountries]);

  const hasActiveFilters = searchName !== "" || filterGothrams.length > 0 || 
    filterHouseNames.length > 0 || filterGenders.length > 0 || filterStates.length > 0 || filterCountries.length > 0;

  const clearFilters = () => {
    setSearchName("");
    setFilterGothrams([]);
    setFilterHouseNames([]);
    setFilterGenders([]);
    setFilterStates([]);
    setFilterCountries([]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const dataToExport = hasActiveFilters ? filteredData : groupedData || [];
    
    doc.setFontSize(18);
    doc.text("Desuru Reddy Community - Submissions", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    if (hasActiveFilters) {
      doc.text(`(Filtered data - ${filteredSubmissions} of ${totalSubmissions} records)`, 14, 36);
    }
    
    const tableData: string[][] = [];
    dataToExport.forEach((group) => {
      group.submissions.forEach((sub) => {
        const displayGothram = sub.gothram === "Other" && sub.otherGothram 
          ? `Other (${sub.otherGothram})` 
          : sub.gothram;
        const displayHouseName = sub.houseName === "Other" && sub.otherHouseName 
          ? `Other (${sub.otherHouseName})` 
          : sub.houseName;
        const displayDOB = sub.dateOfBirth ? new Date(sub.dateOfBirth).toLocaleDateString() : "N/A";
        tableData.push([
          sub.name,
          sub.phoneNumber,
          sub.gender || "N/A",
          displayDOB,
          sub.presentAddress || "N/A",
          sub.nativePlace || "N/A",
          displayGothram,
          displayHouseName,
          sub.state,
          sub.county,
        ]);
      });
    });
    
    autoTable(doc, {
      head: [["Name", "Phone", "Gender", "DOB", "Address", "Native Place", "Gothram", "House Name", "State", "County"]],
      body: tableData,
      startY: hasActiveFilters ? 42 : 36,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`desuru_reddy_submissions_${new Date().toISOString().split("T")[0]}.pdf`);
    
    toast({
      title: "PDF Downloaded",
      description: `Exported ${tableData.length} submissions to PDF.`,
    });
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm
        onSuccess={() => {
          setIsAuthenticated(true);
          queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] });
        }}
      />
    );
  }

  const totalSubmissions =
    groupedData?.reduce((acc, group) => acc + group.count, 0) || 0;
  const totalGothrams = groupedData?.length || 0;
  const filteredSubmissions = filteredData.reduce((acc, group) => acc + group.count, 0);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingImage})` }}
      />
      <div className="fixed inset-0 bg-black/30" />
      <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold" data-testid="text-dashboard-title">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="gap-2"
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dataLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to Load Data</h3>
              <p className="text-muted-foreground">
                Please try refreshing the page.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingData && pendingData.length > 0 && (
              <Card className="border-amber-500/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <CardTitle className="text-lg">Pending Approvals</CardTitle>
                    <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
                      {pendingData.length}
                    </Badge>
                  </div>
                  <CardDescription>
                    These submissions require your approval before being added to the database.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingData.map((submission) => (
                    <PendingApprovalCard
                      key={submission.id}
                      submission={submission}
                      onApprove={(id) => approveMutation.mutate(id)}
                      onReject={(id) => rejectMutation.mutate(id)}
                      isApproving={approvingId === submission.id}
                      isRejecting={rejectingId === submission.id}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Submissions"
                value={totalSubmissions}
                icon={FileText}
              />
              <StatCard
                title="Gothrams"
                value={totalGothrams}
                icon={LayoutDashboard}
              />
              <StatCard
                title="Community"
                value="Desuru Reddy"
                icon={Users}
              />
            </div>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="ml-auto gap-1"
                      data-testid="button-clear-filters"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-name">Search by Name</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search-name"
                        placeholder="Enter name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="pl-9"
                        data-testid="input-search-name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gothram</Label>
                    <MultiSelect
                      label="Gothrams"
                      options={filterOptions.gothrams}
                      selected={filterGothrams}
                      onChange={setFilterGothrams}
                      testId="select-filter-gothram"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>House Name</Label>
                    <MultiSelect
                      label="House Names"
                      options={filterOptions.houseNames}
                      selected={filterHouseNames}
                      onChange={setFilterHouseNames}
                      testId="select-filter-housename"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <MultiSelect
                      label="Genders"
                      options={filterOptions.genders}
                      selected={filterGenders}
                      onChange={setFilterGenders}
                      testId="select-filter-gender"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>State</Label>
                    <MultiSelect
                      label="States"
                      options={filterOptions.states}
                      selected={filterStates}
                      onChange={setFilterStates}
                      testId="select-filter-state"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>County</Label>
                    <MultiSelect
                      label="Counties"
                      options={filterOptions.countries}
                      selected={filterCountries}
                      onChange={setFilterCountries}
                      testId="select-filter-county"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-xl font-semibold text-white" data-testid="text-section-submissions">
                  Submissions by Gothram
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {hasActiveFilters && (
                    <Badge variant="secondary" data-testid="badge-filtered-count">
                      Showing {filteredSubmissions} of {totalSubmissions}
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToPDF}
                    className="gap-2 bg-white dark:bg-card"
                    disabled={!groupedData || totalSubmissions === 0}
                    data-testid="button-export-pdf"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
              {filteredData.length > 0 ? (
                filteredData.map((group) => (
                  <SubmissionGroup key={group.gothram} group={group} />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {hasActiveFilters ? "No Matching Results" : "No Submissions Yet"}
                    </h3>
                    <p className="text-muted-foreground">
                      {hasActiveFilters 
                        ? "Try adjusting your filters to see more results."
                        : "Submissions will appear here once users start submitting their information."}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="mt-4"
                        data-testid="button-clear-filters-empty"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
