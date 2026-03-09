from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    ReportCommentCreate,
    ReportDetail,
    ReportFeed,
    ReportPublishRequest,
    ReportRevisionCreate,
    ReportStatusChange,
    RevisionRequestCreate,
)
from .repository import ReviewRepository
from .seed_data import SEED_REPORTS


DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "review.db"


def create_app(db_path: str | None = None, seed_demo_data: bool = True) -> FastAPI:
    app = FastAPI(
        title="GovCon Signal Review Backend",
        version="0.1.0",
        description="Local backend for internal intelligence review, comments, status changes, and immutable report revisions.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    resolved_db_path = db_path or os.getenv("INTEL_REVIEW_DB_PATH") or str(DEFAULT_DB_PATH)
    repository = ReviewRepository(resolved_db_path)
    if seed_demo_data and os.getenv("INTEL_REVIEW_SEED", "true").lower() != "false":
        repository.seed_if_empty(SEED_REPORTS)
        if repository.report_exists("rpt_20260306_101"):
            detail = repository.get_report("rpt_20260306_101")
            if detail is not None and not detail.comments:
                repository.add_comment(
                    "rpt_20260306_101",
                    ReportCommentCreate(
                        body="Readable first draft. Add one sentence on likely acquisition timing before approval.",
                        authorName="Human Reviewer",
                        authorRole="reviewer",
                        versionNumber=1,
                        createdAt="2026-03-06T17:47:00Z",
                    ),
                )
        if repository.report_exists("rpt_20260306_102"):
            detail = repository.get_report("rpt_20260306_102")
            if detail is not None and not detail.revisionRequests:
                repository.create_revision_request(
                    "rpt_20260306_102",
                    RevisionRequestCreate(
                        requestType="more_detail",
                        body="Add one concrete example of the documentation mismatch this warning is pointing at.",
                        requestedBy="Human Reviewer",
                        requestedByType="reviewer",
                        createdAt="2026-03-06T17:48:00Z",
                    ),
                )

    @app.get("/api/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "database": resolved_db_path}

    @app.get("/api/reports", response_model=ReportFeed)
    def list_reports(
        status: str | None = Query(default=None),
        reportType: str | None = Query(default=None),
        sourceAgency: str | None = Query(default=None),
        priority: str | None = Query(default=None),
        q: str | None = Query(default=None),
    ) -> ReportFeed:
        return repository.list_reports(
            status=status,
            report_type=reportType,
            source_agency=sourceAgency,
            priority=priority,
            query=q,
        )

    @app.post("/api/reports", response_model=ReportDetail, status_code=201)
    def publish_report(payload: ReportPublishRequest) -> ReportDetail:
        try:
            return repository.create_report(payload)
        except ValueError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc

    @app.get("/api/reports/{report_id}", response_model=ReportDetail)
    def get_report(report_id: str) -> ReportDetail:
        report = repository.get_report(report_id)
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return report

    @app.get("/api/reports/{report_id}/comments")
    def get_comments(report_id: str) -> list[dict]:
        report = repository.get_report(report_id)
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return [comment.model_dump() for comment in report.comments]

    @app.post("/api/reports/{report_id}/comments", response_model=ReportDetail, status_code=201)
    def add_comment(report_id: str, payload: ReportCommentCreate) -> ReportDetail:
        try:
            return repository.add_comment(report_id, payload)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Report not found") from exc

    @app.get("/api/reports/{report_id}/versions")
    def get_versions(report_id: str) -> list[dict]:
        report = repository.get_report(report_id)
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return [version.model_dump() for version in report.revisionHistory]

    @app.post("/api/reports/{report_id}/versions", response_model=ReportDetail, status_code=201)
    def create_revision(report_id: str, payload: ReportRevisionCreate) -> ReportDetail:
        try:
            return repository.create_revision(report_id, payload)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Report not found") from exc

    @app.get("/api/reports/{report_id}/revision-requests")
    def get_revision_requests(report_id: str) -> list[dict]:
        report = repository.get_report(report_id)
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return [request.model_dump() for request in report.revisionRequests]

    @app.post("/api/reports/{report_id}/revision-requests", response_model=ReportDetail, status_code=201)
    def create_revision_request(report_id: str, payload: RevisionRequestCreate) -> ReportDetail:
        try:
            return repository.create_revision_request(report_id, payload)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Report not found") from exc

    @app.post("/api/reports/{report_id}/status", response_model=ReportDetail)
    def change_status(report_id: str, payload: ReportStatusChange) -> ReportDetail:
        try:
            return repository.change_status(report_id, payload)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Report not found") from exc

    return app


app = create_app()
