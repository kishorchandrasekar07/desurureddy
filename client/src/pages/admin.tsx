import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { format } from "date-fns";
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
} from "lucide-react";
import type { GroupedSubmissions, Submission } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
import { useToast } from "@/hooks/use-toast";

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
                <CardTitle className="text-lg font-semibold" data-testid={`group-title-${group.lineage.toLowerCase().replace(/\s+/g, "-")}`}>
                  {group.lineage}
                </CardTitle>
                <Badge variant="secondary" className="text-xs" data-testid={`badge-count-${group.lineage.toLowerCase().replace(/\s+/g, "-")}`}>
                  {group.count} {group.count === 1 ? "submission" : "submissions"}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" data-testid={`button-toggle-${group.lineage.toLowerCase().replace(/\s+/g, "-")}`}>
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
                      <TableHead className="text-xs font-medium uppercase tracking-wide">State</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide">County</TableHead>
                      {group.lineage === "Other" && (
                        <TableHead className="text-xs font-medium uppercase tracking-wide">Details</TableHead>
                      )}
                      <TableHead className="text-xs font-medium uppercase tracking-wide">Date</TableHead>
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
                        <TableCell data-testid={`cell-state-${submission.id}`}>
                          {submission.state}
                        </TableCell>
                        <TableCell data-testid={`cell-county-${submission.id}`}>
                          {submission.county}
                        </TableCell>
                        {group.lineage === "Other" && (
                          <TableCell data-testid={`cell-other-${submission.id}`}>
                            {submission.otherLineage || "-"}
                          </TableCell>
                        )}
                        <TableCell className="text-muted-foreground" data-testid={`cell-date-${submission.id}`}>
                          {submission.createdAt
                            ? format(new Date(submission.createdAt), "MMM d, yyyy")
                            : "-"}
                        </TableCell>
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
      const res = await apiRequest("POST", "/api/admin/login", { password });
      return res.json();
    },
    onSuccess: () => {
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
  const { toast } = useToast();

  const { data: authStatus, isLoading: authLoading } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ["/api/admin/status"],
  });

  useEffect(() => {
    if (authStatus !== undefined) {
      setIsAuthenticated(authStatus.isAuthenticated);
    }
  }, [authStatus]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/logout", {});
      return res.json();
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] });
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
    enabled: isAuthenticated === true,
  });

  if (authLoading || isAuthenticated === null) {
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
  const totalLineages = groupedData?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold" data-testid="text-dashboard-title">
                Admin Dashboard
              </h1>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Submissions"
                value={totalSubmissions}
                icon={FileText}
              />
              <StatCard
                title="Lineages"
                value={totalLineages}
                icon={LayoutDashboard}
              />
              <StatCard
                title="Community"
                value="Desuru Reddy"
                icon={Users}
              />
              <StatCard
                title="Status"
                value="Active"
                icon={AlertCircle}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold" data-testid="text-section-submissions">
                Submissions by Lineage
              </h2>
              {groupedData && groupedData.length > 0 ? (
                groupedData.map((group) => (
                  <SubmissionGroup key={group.lineage} group={group} />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
                    <p className="text-muted-foreground">
                      Submissions will appear here once users start submitting their information.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
