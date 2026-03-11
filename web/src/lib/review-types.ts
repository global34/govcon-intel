export type ReportStatus = "draft" | "in_review" | "needs_update" | "approved" | "archived";
export type ReportPriority = "low" | "medium" | "high";

export type RevisionRequest = {
  id: string;
  reportId: string;
  requestType: string;
  status: string;
  body: string;
  requestedBy: string | null;
  requestedByType: string | null;
  requestedVersion: number;
  resolvedVersion: number | null;
  createdAt: string;
  resolvedAt: string | null;
};

export type ReportComment = {
  id: string;
  reportId: string;
  versionNumber: number | null;
  commentType: string;
  body: string;
  authorName: string | null;
  authorRole: string | null;
  createdAt: string;
};

export type StatusHistoryEvent = {
  id: string;
  reportId: string;
  fromStatus: ReportStatus | null;
  toStatus: ReportStatus;
  note: string | null;
  changedBy: string | null;
  changedByType: string | null;
  createdAt: string;
};

export type ReportVersionSummary = {
  version: number;
  title: string;
  summary: string;
  body: string;
  date: string;
  reportType: string;
  sourceAgency: string;
  priority: ReportPriority;
  actionItems: string[];
  uncertaintyNote: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  createdBy: string | null;
  createdByType: string | null;
  changeSummary: string;
};

export type ReportSummary = {
  id: string;
  title: string;
  summary: string;
  date: string;
  reportType: string;
  sourceAgency: string;
  priority: ReportPriority;
  status: ReportStatus;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  openRevisionRequestCount: number;
  latestRevisionRequestAt: string | null;
};

export type ReportDetail = {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string;
  reportType: string;
  sourceAgency: string;
  priority: ReportPriority;
  status: ReportStatus;
  currentVersion: number;
  actionItems: string[];
  uncertaintyNote: string | null;
  metadata: Record<string, unknown>;
  externalReference: string | null;
  createdBy: string | null;
  createdByType: string | null;
  createdAt: string;
  updatedAt: string;
  revisionRequests: RevisionRequest[];
  revisionHistory: ReportVersionSummary[];
  comments: ReportComment[];
  statusHistory: StatusHistoryEvent[];
};

export type ReportFeed = {
  items: ReportSummary[];
  total: number;
};
