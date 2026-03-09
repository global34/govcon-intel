# SDVOSBNews Local MVP

This workspace now contains the first local MVP for `SDVOSBNews.com`:

- `web/`: Next.js public site plus internal review and ops views
- `review-interface/backend/`: FastAPI review backend with seeded local data
- `SDVOSBNews-blueprint.md`: operating blueprint for the business and system design

## Local run

### 1. Install root tooling

```bash
cd "/Users/scottwarren/Desktop/AI_Folder/GovCon Signal"
npm install
```

### 2. Install Python dependencies

```bash
cd "/Users/scottwarren/Desktop/AI_Folder/GovCon Signal/review-interface/backend"
python3 -m pip install -r requirements.txt
```

### 3. Start the stack

```bash
cd "/Users/scottwarren/Desktop/AI_Folder/GovCon Signal"
npm run dev
```

Local URLs:

- Public site: `http://127.0.0.1:3000`
- Newsletter landing page: `http://127.0.0.1:3000/newsletter`
- Signals archive: `http://127.0.0.1:3000/signals`
- Internal review dashboard: `http://127.0.0.1:3000/admin/review`
- Ops dashboard: `http://127.0.0.1:3000/admin/ops`
- Review API health: `http://127.0.0.1:8010/api/health`

If port `3000` is already occupied, Next.js will automatically move the web app to the next open port such as `3001`.

## What is implemented

- Public homepage, newsletter page, signals archive, and premium offer page
- Local newsletter signup capture via `web/src/app/api/signup/route.ts`
- Internal review dashboard wired to the existing FastAPI backend
- Ops dashboard showing the capability-gap model and workflow state

## Verification commands

```bash
cd "/Users/scottwarren/Desktop/AI_Folder/GovCon Signal"
npm run lint:web
npm run build:web
npm run test:review-api
```

## Notes

- Local subscriber captures are stored in `web/data/subscribers.json`.
- The review dashboard expects the backend to be available at `http://127.0.0.1:8010/api`.
- Payment, email provider integration, CMS publishing, and LangGraph worker execution are still next-phase work.
