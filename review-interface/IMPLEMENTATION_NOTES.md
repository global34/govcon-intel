# Backend Implementation Notes

## Model

- `reports`: current feed-facing state for each report
- `report_versions`: immutable version snapshots for body and structured metadata
- `revision_requests`: reviewer requests with open/fulfilled lifecycle and version linkage
- `comments`: human and system commentary attached to a report and optional version
- `status_history`: explicit audit trail for workflow changes

## Workflow

1. Publisher submits a structured report through `POST /api/reports`
2. Reviewer reads report detail and leaves comments or a revision request
3. Revision request changes report status to `needs_update`
4. Writer or agent submits a new immutable version through `POST /api/reports/{id}/versions`
5. Resolved requests remain visible and linked to the version that addressed them
6. Reviewer moves the report toward `approved` or `archived` via `POST /api/reports/{id}/status`

## Storage

- SQLite database at `backend/data/review.db` by default
- pure standard-library persistence through `sqlite3`
- no destructive updates to prior versions or reviewer requests

## Handoff Notes

- The frontend can treat `GET /api/reports` as the feed endpoint and `GET /api/reports/{id}` as the detail endpoint
- Mutation endpoints return the updated report detail to simplify local UI state refreshes
- Seed data mirrors the payload contract in `plans/GOV-21-report-payloads.md`
- Filters supported today: `status`, `reportType`, `sourceAgency`, `priority`, `q`
