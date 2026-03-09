from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from app.models import ReportCommentCreate, ReportPublishRequest, ReportRevisionCreate, RevisionRequestCreate
from app.repository import ReviewRepository


class ReviewRepositoryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "review.db"
        self.repository = ReviewRepository(str(self.db_path))

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_create_report_persists_first_revision(self) -> None:
        detail = self.repository.create_report(
            ReportPublishRequest(
                id="rpt_test_001",
                title="Test report",
                summary="Short summary",
                body="## Body\nTest",
                date="2026-03-06",
                reportType="opportunity_alert",
                sourceAgency="Test Agency",
                priority="high",
                status="draft",
                actionItems=["Do the thing"],
                createdBy="Briefing Writer",
                createdByType="agent",
            )
        )
        self.assertEqual(detail.id, "rpt_test_001")
        self.assertEqual(detail.currentVersion, 1)
        self.assertEqual(len(detail.revisionHistory), 1)
        self.assertEqual(detail.statusHistory[-1].toStatus, "draft")

    def test_revision_request_and_revision_preserve_history(self) -> None:
        self.repository.create_report(
            ReportPublishRequest(
                id="rpt_test_002",
                title="Needs update",
                summary="Summary",
                body="Body",
                date="2026-03-06",
                reportType="budget_signal_brief",
                sourceAgency="Agency",
                priority="medium",
                status="in_review",
            )
        )
        updated = self.repository.create_revision_request(
            "rpt_test_002",
            RevisionRequestCreate(
                requestType="update",
                body="Please refresh timing.",
                requestedBy="Reviewer",
                requestedByType="reviewer",
            ),
        )
        self.assertEqual(updated.status, "needs_update")
        self.assertEqual(len(updated.revisionRequests), 1)
        request_id = updated.revisionRequests[0].id

        revised = self.repository.create_revision(
            "rpt_test_002",
            ReportRevisionCreate(
                title="Needs update",
                summary="Summary revised",
                body="Body revised",
                date="2026-03-07",
                reportType="budget_signal_brief",
                sourceAgency="Agency",
                priority="medium",
                actionItems=["Refresh timing"],
                changeSummary="Updated timing details",
                createdBy="Briefing Writer",
                createdByType="agent",
                resolvedRevisionRequestIds=[request_id],
            ),
        )
        self.assertEqual(revised.currentVersion, 2)
        self.assertEqual(revised.status, "in_review")
        self.assertEqual(len(revised.revisionHistory), 2)
        self.assertEqual(revised.revisionRequests[0].status, "fulfilled")

    def test_comments_attach_without_overwriting_versions(self) -> None:
        self.repository.create_report(
            ReportPublishRequest(
                id="rpt_test_003",
                title="Commentable report",
                summary="Summary",
                body="Body",
                date="2026-03-06",
                reportType="weekly_intelligence_report",
                sourceAgency="Agency",
                priority="low",
                status="draft",
            )
        )
        detail = self.repository.add_comment(
            "rpt_test_003",
            ReportCommentCreate(body="Looks good.", authorName="Reviewer", authorRole="reviewer"),
        )
        self.assertEqual(len(detail.comments), 1)
        self.assertEqual(detail.currentVersion, 1)
        self.assertEqual(len(detail.revisionHistory), 1)


if __name__ == "__main__":
    unittest.main()
