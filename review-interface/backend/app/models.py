from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


ReportStatus = Literal["draft", "in_review", "needs_update", "approved", "archived"]
ReportPriority = Literal["low", "medium", "high"]
CommentType = Literal["comment", "revision_request", "system"]
RevisionRequestType = Literal["more_detail", "update", "revision"]
RevisionRequestStatus = Literal["open", "fulfilled", "cancelled"]


class ReviewBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ReportPublishRequest(ReviewBaseModel):
    id: str | None = None
    title: str = Field(min_length=3, max_length=240)
    summary: str = Field(min_length=3, max_length=800)
    body: str = Field(min_length=3)
    date: str = Field(min_length=10, max_length=10)
    reportType: str = Field(min_length=2, max_length=120)
    sourceAgency: str = Field(min_length=2, max_length=160)
    priority: ReportPriority = "medium"
    status: ReportStatus = "draft"
    actionItems: list[str] = Field(default_factory=list)
    uncertaintyNote: str | None = Field(default=None, max_length=800)
    metadata: dict[str, Any] = Field(default_factory=dict)
    createdBy: str | None = Field(default=None, max_length=120)
    createdByType: str | None = Field(default=None, max_length=80)
    externalReference: str | None = Field(default=None, max_length=200)
    changeSummary: str | None = Field(default=None, max_length=240)
    createdAt: str | None = None


class ReportRevisionCreate(ReviewBaseModel):
    title: str = Field(min_length=3, max_length=240)
    summary: str = Field(min_length=3, max_length=800)
    body: str = Field(min_length=3)
    date: str = Field(min_length=10, max_length=10)
    reportType: str = Field(min_length=2, max_length=120)
    sourceAgency: str = Field(min_length=2, max_length=160)
    priority: ReportPriority = "medium"
    status: ReportStatus | None = None
    actionItems: list[str] = Field(default_factory=list)
    uncertaintyNote: str | None = Field(default=None, max_length=800)
    metadata: dict[str, Any] = Field(default_factory=dict)
    changeSummary: str = Field(min_length=3, max_length=240)
    createdBy: str | None = Field(default=None, max_length=120)
    createdByType: str | None = Field(default=None, max_length=80)
    resolvedRevisionRequestIds: list[str] = Field(default_factory=list)
    createdAt: str | None = None


class ReportCommentCreate(ReviewBaseModel):
    body: str = Field(min_length=1, max_length=5000)
    authorName: str | None = Field(default=None, max_length=120)
    authorRole: str | None = Field(default=None, max_length=80)
    commentType: CommentType = "comment"
    versionNumber: int | None = Field(default=None, ge=1)
    createdAt: str | None = None


class ReportStatusChange(ReviewBaseModel):
    status: ReportStatus
    note: str | None = Field(default=None, max_length=5000)
    changedBy: str | None = Field(default=None, max_length=120)
    changedByType: str | None = Field(default=None, max_length=80)
    createdAt: str | None = None


class RevisionRequestCreate(ReviewBaseModel):
    requestType: RevisionRequestType
    body: str = Field(min_length=1, max_length=5000)
    requestedBy: str | None = Field(default=None, max_length=120)
    requestedByType: str | None = Field(default=None, max_length=80)
    createdAt: str | None = None


class ReportVersionSummary(ReviewBaseModel):
    version: int
    title: str
    summary: str
    body: str
    date: str
    reportType: str
    sourceAgency: str
    priority: ReportPriority
    actionItems: list[str]
    uncertaintyNote: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    createdAt: str
    createdBy: str | None = None
    createdByType: str | None = None
    changeSummary: str


class ReportComment(ReviewBaseModel):
    id: str
    reportId: str
    versionNumber: int | None = None
    commentType: CommentType
    body: str
    authorName: str | None = None
    authorRole: str | None = None
    createdAt: str


class RevisionRequest(ReviewBaseModel):
    id: str
    reportId: str
    requestType: RevisionRequestType
    status: RevisionRequestStatus
    body: str
    requestedBy: str | None = None
    requestedByType: str | None = None
    requestedVersion: int
    resolvedVersion: int | None = None
    createdAt: str
    resolvedAt: str | None = None


class StatusHistoryEvent(ReviewBaseModel):
    id: str
    reportId: str
    fromStatus: ReportStatus | None = None
    toStatus: ReportStatus
    note: str | None = None
    changedBy: str | None = None
    changedByType: str | None = None
    createdAt: str


class ReportSummary(ReviewBaseModel):
    id: str
    title: str
    summary: str
    date: str
    reportType: str
    sourceAgency: str
    priority: ReportPriority
    status: ReportStatus
    currentVersion: int
    createdAt: str
    updatedAt: str
    openRevisionRequestCount: int
    latestRevisionRequestAt: str | None = None


class ReportFeed(ReviewBaseModel):
    items: list[ReportSummary]
    total: int


class ReportDetail(ReviewBaseModel):
    id: str
    title: str
    summary: str
    body: str
    date: str
    reportType: str
    sourceAgency: str
    priority: ReportPriority
    status: ReportStatus
    currentVersion: int
    actionItems: list[str]
    uncertaintyNote: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    externalReference: str | None = None
    createdBy: str | None = None
    createdByType: str | None = None
    createdAt: str
    updatedAt: str
    revisionRequests: list[RevisionRequest]
    revisionHistory: list[ReportVersionSummary]
    comments: list[ReportComment]
    statusHistory: list[StatusHistoryEvent]
