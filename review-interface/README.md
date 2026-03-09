# GovCon Signal Review Interface MVP

Local-first workspace for the internal intelligence review interface requested in `GOV-19`.

## Backend

The backend lives in `GovCon Signal/review-interface/backend` and uses:

- FastAPI for the local API surface
- SQLite for persistent local storage
- immutable `report_versions` records for revision history
- explicit `revision_requests`, `comments`, and `status_history` tables for reviewer workflow

### Run locally

```bash
cd "GovCon Signal/review-interface/backend"
python3 -m uvicorn app.main:app --reload --port 8010
```

Optional environment variables:

- `INTEL_REVIEW_DB_PATH` to override the SQLite file path
- `INTEL_REVIEW_SEED=false` to start without demo reports

### API summary

- `GET /api/health`
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/reports/{reportId}`
- `GET /api/reports/{reportId}/comments`
- `POST /api/reports/{reportId}/comments`
- `GET /api/reports/{reportId}/versions`
- `POST /api/reports/{reportId}/versions`
- `GET /api/reports/{reportId}/revision-requests`
- `POST /api/reports/{reportId}/revision-requests`
- `POST /api/reports/{reportId}/status`

### Publish payload

The backend accepts the report payload drafted in `plans/GOV-21-report-payloads.md` with a few optional publishing fields:

- `metadata`
- `createdBy`
- `createdByType`
- `externalReference`
- `changeSummary`

### Validation

```bash
cd "GovCon Signal/review-interface/backend"
PYTHONPATH=. python3 -m unittest tests.test_repository
```
