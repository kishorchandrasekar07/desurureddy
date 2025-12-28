import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
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
} from "lucide-react";
import { useState } from "react";
import type { GroupedSubmissions, Submission } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { isUnauthorizedError } from "@/lib/auth-utils";

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
                <CardTitle className="text-lg font-semibold" data-testid={`group-title-${group.category.toLowerCase().replace(/\s+/g, "-")}`}>
                  {group.category}
                </CardTitle>
                <Badge variant="secondary" className="text-xs" data-testid={`badge-count-${group.category.toLowerCase().replace(/\s+/g, "-")}`}>
                  {group.count} {group.count === 1 ? "submission" : "submissions"}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" data-testid={`button-toggle-${group.category.toLowerCase().replace(/\s+/g, "-")}`}>
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
                      {group.category === "Other" && (
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
                        {group.category === "Other" && (
                          <TableCell data-testid={`cell-other-${submission.id}`}>
                            {submission.otherCategory || "-"}
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

export default function Admin() {
  const { user, isLoading: authLoading, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  const {
    data: groupedData,
    isLoading: dataLoading,
    error,
  } = useQuery<GroupedSubmissions[]>({
    queryKey: ["/api/submissions/grouped"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Session Expired",
        description: "Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalSubmissions =
    groupedData?.reduce((acc, group) => acc + group.count, 0) || 0;
  const totalCategories = groupedData?.length || 0;

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
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                    <AvatarFallback>
                      {user.firstName?.[0] || user.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline" data-testid="text-user-name">
                    {user.firstName || user.email}
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="gap-2"
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
        ) : error && !isUnauthorizedError(error as Error) ? (
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
                title="Categories"
                value={totalCategories}
                icon={LayoutDashboard}
              />
              <StatCard
                title="Assigned To"
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
                Submissions by Category
              </h2>
              {groupedData && groupedData.length > 0 ? (
                groupedData.map((group) => (
                  <SubmissionGroup key={group.category} group={group} />
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
