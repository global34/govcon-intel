from __future__ import annotations

import json
import sqlite3
import uuid
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

from .models import (
    ReportComment,
    ReportCommentCreate,
    ReportDetail,
    ReportFeed,
    ReportPublishRequest,
    ReportRevisionCreate,
    ReportStatusChange,
    ReportSummary,
    ReportVersionSummary,
    RevisionRequest,
    RevisionRequestCreate,
    StatusHistoryEvent,
)


def utc_now() -> str:
    from datetime import UTC, datetime

    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


class ReviewRepository:
    def __init__(self, db_path: str) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize_schema()

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def _initialize_schema(self) -> None:
        with self._connect() as conn:
            conn.executescript(
                """
                PRAGMA foreign_keys = ON;

                CREATE TABLE IF NOT EXISTS reports (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    report_date TEXT NOT NULL,
                    report_type TEXT NOT NULL,
                    source_agency TEXT NOT NULL,
                    priority TEXT NOT NULL,
                    status TEXT NOT NULL,
                    current_version_number INTEGER NOT NULL,
                    uncertainty_note TEXT,
                    metadata_json TEXT NOT NULL DEFAULT '{}',
                    external_reference TEXT,
                    created_by TEXT,
                    created_by_type TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS report_versions (
                    report_id TEXT NOT NULL,
                    version_number INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    body TEXT NOT NULL,
                    report_date TEXT NOT NULL,
                    report_type TEXT NOT NULL,
                    source_agency TEXT NOT NULL,
                    priority TEXT NOT NULL,
                    action_items_json TEXT NOT NULL DEFAULT '[]',
                    uncertainty_note TEXT,
                    metadata_json TEXT NOT NULL DEFAULT '{}',
                    change_summary TEXT NOT NULL,
                    created_by TEXT,
                    created_by_type TEXT,
                    created_at TEXT NOT NULL,
                    PRIMARY KEY (report_id, version_number),
                    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS comments (
                    id TEXT PRIMARY KEY,
                    report_id TEXT NOT NULL,
                    version_number INTEGER,
                    comment_type TEXT NOT NULL,
                    body TEXT NOT NULL,
                    author_name TEXT,
                    author_role TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS revision_requests (
                    id TEXT PRIMARY KEY,
                    report_id TEXT NOT NULL,
                    request_type TEXT NOT NULL,
                    status TEXT NOT NULL,
                    body TEXT NOT NULL,
                    requested_by TEXT,
                    requested_by_type TEXT,
                    requested_version_number INTEGER NOT NULL,
                    resolved_version_number INTEGER,
                    created_at TEXT NOT NULL,
                    resolved_at TEXT,
                    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS status_history (
                    id TEXT PRIMARY KEY,
                    report_id TEXT NOT NULL,
                    from_status TEXT,
                    to_status TEXT NOT NULL,
                    note TEXT,
                    changed_by TEXT,
                    changed_by_type TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
                );
                """
            )

    def report_exists(self, report_id: str) -> bool:
        with self._connect() as conn:
            row = conn.execute("SELECT 1 FROM reports WHERE id = ?", (report_id,)).fetchone()
        return row is not None

    def list_reports(
        self,
        *,
        status: str | None = None,
        report_type: str | None = None,
        source_agency: str | None = None,
        priority: str | None = None,
        query: str | None = None,
    ) -> ReportFeed:
        filters = []
        params: list[Any] = []
        if status:
            filters.append("r.status = ?")
            params.append(status)
        if report_type:
            filters.append("r.report_type = ?")
            params.append(report_type)
        if source_agency:
            filters.append("r.source_agency = ?")
            params.append(source_agency)
        if priority:
            filters.append("r.priority = ?")
            params.append(priority)
        if query:
            filters.append("(r.title LIKE ? OR r.summary LIKE ? OR r.source_agency LIKE ? OR r.report_type LIKE ?)")
            like = f"%{query}%"
            params.extend([like, like, like, like])
        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""
        with self._connect() as conn:
            rows = conn.execute(
                f"""
                SELECT
                    r.id,
                    r.title,
                    r.summary,
                    r.report_date,
                    r.report_type,
                    r.source_agency,
                    r.priority,
                    r.status,
                    r.current_version_number,
                    r.created_at,
                    r.updated_at,
                    COALESCE(rr.open_count, 0) AS open_revision_request_count,
                    rr.latest_revision_request_at
                FROM reports r
                LEFT JOIN (
                    SELECT
                        report_id,
                        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_count,
                        MAX(created_at) AS latest_revision_request_at
                    FROM revision_requests
                    GROUP BY report_id
                ) rr ON rr.report_id = r.id
                {where_clause}
                ORDER BY r.report_date DESC, r.updated_at DESC
                """,
                params,
            ).fetchall()
        items = [self._to_report_summary(row) for row in rows]
        return ReportFeed(items=items, total=len(items))

    def get_report(self, report_id: str) -> ReportDetail | None:
        with self._connect() as conn:
            report = conn.execute(
                "SELECT * FROM reports WHERE id = ?",
                (report_id,),
            ).fetchone()
            if report is None:
                return None

            current_version = conn.execute(
                "SELECT * FROM report_versions WHERE report_id = ? AND version_number = ?",
                (report_id, report["current_version_number"]),
            ).fetchone()
            versions = conn.execute(
                "SELECT * FROM report_versions WHERE report_id = ? ORDER BY version_number DESC",
                (report_id,),
            ).fetchall()
            comments = conn.execute(
                "SELECT * FROM comments WHERE report_id = ? ORDER BY created_at ASC, id ASC",
                (report_id,),
            ).fetchall()
            revision_requests = conn.execute(
                "SELECT * FROM revision_requests WHERE report_id = ? ORDER BY created_at DESC, id DESC",
                (report_id,),
            ).fetchall()
            status_history = conn.execute(
                "SELECT * FROM status_history WHERE report_id = ? ORDER BY created_at ASC, id ASC",
                (report_id,),
            ).fetchall()

        return ReportDetail(
            id=report["id"],
            title=current_version["title"],
            summary=current_version["summary"],
            body=current_version["body"],
            date=current_version["report_date"],
            reportType=current_version["report_type"],
            sourceAgency=current_version["source_agency"],
            priority=current_version["priority"],
            status=report["status"],
            currentVersion=report["current_version_number"],
            actionItems=self._loads(current_version["action_items_json"], []),
            uncertaintyNote=current_version["uncertainty_note"],
            metadata=self._loads(current_version["metadata_json"], {}),
            externalReference=report["external_reference"],
            createdBy=report["created_by"],
            createdByType=report["created_by_type"],
            createdAt=report["created_at"],
            updatedAt=report["updated_at"],
            revisionRequests=[self._to_revision_request(row) for row in revision_requests],
            revisionHistory=[self._to_report_version(row) for row in versions],
            comments=[self._to_comment(row) for row in comments],
            statusHistory=[self._to_status_event(row) for row in status_history],
        )

    def create_report(self, payload: ReportPublishRequest) -> ReportDetail:
        report_id = payload.id or f"rpt_{uuid.uuid4().hex[:12]}"
        if self.report_exists(report_id):
            raise ValueError(f"Report '{report_id}' already exists")
        created_at = payload.createdAt or utc_now()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO reports (
                    id, title, summary, report_date, report_type, source_agency, priority,
                    status, current_version_number, uncertainty_note, metadata_json,
                    external_reference, created_by, created_by_type, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    report_id,
                    payload.title,
                    payload.summary,
                    payload.date,
                    payload.reportType,
                    payload.sourceAgency,
                    payload.priority,
                    payload.status,
                    1,
                    payload.uncertaintyNote,
                    json.dumps(payload.metadata),
                    payload.externalReference,
                    payload.createdBy,
                    payload.createdByType,
                    created_at,
                    created_at,
                ),
            )
            conn.execute(
                """
                INSERT INTO report_versions (
                    report_id, version_number, title, summary, body, report_date,
                    report_type, source_agency, priority, action_items_json,
                    uncertainty_note, metadata_json, change_summary, created_by,
                    created_by_type, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    report_id,
                    1,
                    payload.title,
                    payload.summary,
                    payload.body,
                    payload.date,
                    payload.reportType,
                    payload.sourceAgency,
                    payload.priority,
                    json.dumps(payload.actionItems),
                    payload.uncertaintyNote,
                    json.dumps(payload.metadata),
                    payload.changeSummary or "Initial report published",
                    payload.createdBy,
                    payload.createdByType,
                    created_at,
                ),
            )
            self._insert_status_history(
                conn,
                report_id=report_id,
                from_status=None,
                to_status=payload.status,
                note=payload.changeSummary or "Initial report published",
                changed_by=payload.createdBy,
                changed_by_type=payload.createdByType,
                created_at=created_at,
            )
        detail = self.get_report(report_id)
        if detail is None:
            raise RuntimeError("New report was not persisted")
        return detail

    def add_comment(self, report_id: str, payload: ReportCommentCreate) -> ReportDetail:
        report = self.get_report(report_id)
        if report is None:
            raise KeyError(report_id)
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO comments (
                    id, report_id, version_number, comment_type, body,
                    author_name, author_role, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    str(uuid.uuid4()),
                    report_id,
                    payload.versionNumber,
                    payload.commentType,
                    payload.body,
                    payload.authorName,
                    payload.authorRole,
                    payload.createdAt or utc_now(),
                ),
            )
        detail = self.get_report(report_id)
        if detail is None:
            raise RuntimeError("Comment write failed")
        return detail

    def change_status(self, report_id: str, payload: ReportStatusChange) -> ReportDetail:
        report = self.get_report(report_id)
        if report is None:
            raise KeyError(report_id)
        created_at = payload.createdAt or utc_now()
        with self._connect() as conn:
            conn.execute(
                "UPDATE reports SET status = ?, updated_at = ? WHERE id = ?",
                (payload.status, created_at, report_id),
            )
            self._insert_status_history(
                conn,
                report_id=report_id,
                from_status=report.status,
                to_status=payload.status,
                note=payload.note,
                changed_by=payload.changedBy,
                changed_by_type=payload.changedByType,
                created_at=created_at,
            )
            if payload.note:
                self._insert_comment(
                    conn,
                    report_id=report_id,
                    comment_type="system",
                    body=payload.note,
                    author_name=payload.changedBy,
                    author_role=payload.changedByType,
                    version_number=report.currentVersion,
                    created_at=created_at,
                )
        detail = self.get_report(report_id)
        if detail is None:
            raise RuntimeError("Status change failed")
        return detail

    def create_revision_request(self, report_id: str, payload: RevisionRequestCreate) -> ReportDetail:
        report = self.get_report(report_id)
        if report is None:
            raise KeyError(report_id)
        created_at = payload.createdAt or utc_now()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO revision_requests (
                    id, report_id, request_type, status, body, requested_by,
                    requested_by_type, requested_version_number, resolved_version_number,
                    created_at, resolved_at
                ) VALUES (?, ?, ?, 'open', ?, ?, ?, ?, NULL, ?, NULL)
                """,
                (
                    str(uuid.uuid4()),
                    report_id,
                    payload.requestType,
                    payload.body,
                    payload.requestedBy,
                    payload.requestedByType,
                    report.currentVersion,
                    created_at,
                ),
            )
            self._insert_comment(
                conn,
                report_id=report_id,
                comment_type="revision_request",
                body=payload.body,
                author_name=payload.requestedBy,
                author_role=payload.requestedByType,
                version_number=report.currentVersion,
                created_at=created_at,
            )
            conn.execute(
                "UPDATE reports SET status = 'needs_update', updated_at = ? WHERE id = ?",
                (created_at, report_id),
            )
            self._insert_status_history(
                conn,
                report_id=report_id,
                from_status=report.status,
                to_status="needs_update",
                note=payload.body,
                changed_by=payload.requestedBy,
                changed_by_type=payload.requestedByType,
                created_at=created_at,
            )
        detail = self.get_report(report_id)
        if detail is None:
            raise RuntimeError("Revision request failed")
        return detail

    def create_revision(self, report_id: str, payload: ReportRevisionCreate) -> ReportDetail:
        report = self.get_report(report_id)
        if report is None:
            raise KeyError(report_id)
        next_version = report.currentVersion + 1
        created_at = payload.createdAt or utc_now()
        next_status = payload.status or ("in_review" if report.status == "needs_update" else report.status)
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO report_versions (
                    report_id, version_number, title, summary, body, report_date,
                    report_type, source_agency, priority, action_items_json,
                    uncertainty_note, metadata_json, change_summary, created_by,
                    created_by_type, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    report_id,
                    next_version,
                    payload.title,
                    payload.summary,
                    payload.body,
                    payload.date,
                    payload.reportType,
                    payload.sourceAgency,
                    payload.priority,
                    json.dumps(payload.actionItems),
                    payload.uncertaintyNote,
                    json.dumps(payload.metadata),
                    payload.changeSummary,
                    payload.createdBy,
                    payload.createdByType,
                    created_at,
                ),
            )
            conn.execute(
                """
                UPDATE reports
                SET title = ?, summary = ?, report_date = ?, report_type = ?, source_agency = ?,
                    priority = ?, status = ?, current_version_number = ?, uncertainty_note = ?,
                    metadata_json = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    payload.title,
                    payload.summary,
                    payload.date,
                    payload.reportType,
                    payload.sourceAgency,
                    payload.priority,
                    next_status,
                    next_version,
                    payload.uncertaintyNote,
                    json.dumps(payload.metadata),
                    created_at,
                    report_id,
                ),
            )
            self._insert_comment(
                conn,
                report_id=report_id,
                comment_type="system",
                body=payload.changeSummary,
                author_name=payload.createdBy,
                author_role=payload.createdByType,
                version_number=next_version,
                created_at=created_at,
            )
            if next_status != report.status:
                self._insert_status_history(
                    conn,
                    report_id=report_id,
                    from_status=report.status,
                    to_status=next_status,
                    note=payload.changeSummary,
                    changed_by=payload.createdBy,
                    changed_by_type=payload.createdByType,
                    created_at=created_at,
                )
            if payload.resolvedRevisionRequestIds:
                placeholders = ", ".join("?" for _ in payload.resolvedRevisionRequestIds)
                conn.execute(
                    f"""
                    UPDATE revision_requests
                    SET status = 'fulfilled', resolved_version_number = ?, resolved_at = ?
                    WHERE report_id = ? AND id IN ({placeholders})
                    """,
                    [next_version, created_at, report_id, *payload.resolvedRevisionRequestIds],
                )
        detail = self.get_report(report_id)
        if detail is None:
            raise RuntimeError("Revision write failed")
        return detail

    def seed_if_empty(self, seed_reports: list[ReportPublishRequest]) -> None:
        with self._connect() as conn:
            row = conn.execute("SELECT COUNT(*) AS count FROM reports").fetchone()
        if row is None or row["count"] != 0:
            return
        for payload in seed_reports:
            self.create_report(payload)

    def _insert_comment(
        self,
        conn: sqlite3.Connection,
        *,
        report_id: str,
        comment_type: str,
        body: str,
        author_name: str | None,
        author_role: str | None,
        version_number: int | None,
        created_at: str,
    ) -> None:
        conn.execute(
            """
            INSERT INTO comments (
                id, report_id, version_number, comment_type, body,
                author_name, author_role, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                report_id,
                version_number,
                comment_type,
                body,
                author_name,
                author_role,
                created_at,
            ),
        )

    def _insert_status_history(
        self,
        conn: sqlite3.Connection,
        *,
        report_id: str,
        from_status: str | None,
        to_status: str,
        note: str | None,
        changed_by: str | None,
        changed_by_type: str | None,
        created_at: str,
    ) -> None:
        conn.execute(
            """
            INSERT INTO status_history (
                id, report_id, from_status, to_status, note,
                changed_by, changed_by_type, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                report_id,
                from_status,
                to_status,
                note,
                changed_by,
                changed_by_type,
                created_at,
            ),
        )

    def _to_report_summary(self, row: sqlite3.Row) -> ReportSummary:
        return ReportSummary(
            id=row["id"],
            title=row["title"],
            summary=row["summary"],
            date=row["report_date"],
            reportType=row["report_type"],
            sourceAgency=row["source_agency"],
            priority=row["priority"],
            status=row["status"],
            currentVersion=row["current_version_number"],
            createdAt=row["created_at"],
            updatedAt=row["updated_at"],
            openRevisionRequestCount=row["open_revision_request_count"],
            latestRevisionRequestAt=row["latest_revision_request_at"],
        )

    def _to_report_version(self, row: sqlite3.Row) -> ReportVersionSummary:
        return ReportVersionSummary(
            version=row["version_number"],
            title=row["title"],
            summary=row["summary"],
            body=row["body"],
            date=row["report_date"],
            reportType=row["report_type"],
            sourceAgency=row["source_agency"],
            priority=row["priority"],
            actionItems=self._loads(row["action_items_json"], []),
            uncertaintyNote=row["uncertainty_note"],
            metadata=self._loads(row["metadata_json"], {}),
            createdAt=row["created_at"],
            createdBy=row["created_by"],
            createdByType=row["created_by_type"],
            changeSummary=row["change_summary"],
        )

    def _to_comment(self, row: sqlite3.Row) -> ReportComment:
        return ReportComment(
            id=row["id"],
            reportId=row["report_id"],
            versionNumber=row["version_number"],
            commentType=row["comment_type"],
            body=row["body"],
            authorName=row["author_name"],
            authorRole=row["author_role"],
            createdAt=row["created_at"],
        )

    def _to_revision_request(self, row: sqlite3.Row) -> RevisionRequest:
        return RevisionRequest(
            id=row["id"],
            reportId=row["report_id"],
            requestType=row["request_type"],
            status=row["status"],
            body=row["body"],
            requestedBy=row["requested_by"],
            requestedByType=row["requested_by_type"],
            requestedVersion=row["requested_version_number"],
            resolvedVersion=row["resolved_version_number"],
            createdAt=row["created_at"],
            resolvedAt=row["resolved_at"],
        )

    def _to_status_event(self, row: sqlite3.Row) -> StatusHistoryEvent:
        return StatusHistoryEvent(
            id=row["id"],
            reportId=row["report_id"],
            fromStatus=row["from_status"],
            toStatus=row["to_status"],
            note=row["note"],
            changedBy=row["changed_by"],
            changedByType=row["changed_by_type"],
            createdAt=row["created_at"],
        )

    @staticmethod
    def _loads(value: str | None, default: Any) -> Any:
        if not value:
            return default
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return default
