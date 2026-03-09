"use client";

import { useDeferredValue, useEffect, useState } from "react";

import type { ReportDetail, ReportSummary } from "@/lib/review-types";

const API_BASE = process.env.NEXT_PUBLIC_REVIEW_API_BASE ?? "http://127.0.0.1:8010/api";

export function ReviewDashboard() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let isCancelled = false;

    async function loadReports() {
      setIsLoadingList(true);
      setError(null);

      const params = new URLSearchParams();
      if (status !== "all") {
        params.set("status", status);
      }
      if (deferredSearch.trim()) {
        params.set("q", deferredSearch.trim());
      }

      try {
        const response = await fetch(`${API_BASE}/reports?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Report list request failed with ${response.status}`);
        }

        const body = (await response.json()) as { items: ReportSummary[] };
        if (isCancelled) {
          return;
        }

        setReports(body.items);
        setSelectedId((currentId) => {
          if (currentId && body.items.some((item) => item.id === currentId)) {
            return currentId;
          }
          return body.items[0]?.id ?? null;
        });
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load reports.");
          setReports([]);
          setDetail(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingList(false);
        }
      }
    }

    void loadReports();

    return () => {
      isCancelled = true;
    };
  }, [deferredSearch, status]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    let isCancelled = false;

    async function loadDetail() {
      setIsLoadingDetail(true);
      try {
        const response = await fetch(`${API_BASE}/reports/${selectedId}`);
        if (!response.ok) {
          throw new Error(`Report detail request failed with ${response.status}`);
        }
        const body = (await response.json()) as ReportDetail;
        if (!isCancelled) {
          setDetail(body);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load report detail.");
          setDetail(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingDetail(false);
        }
      }
    }

    void loadDetail();

    return () => {
      isCancelled = true;
    };
  }, [selectedId]);

  return (
    <div className="review-dashboard">
      <section className="review-toolbar card">
        <div>
          <p className="eyebrow">Internal review</p>
          <h1>Editorial review queue</h1>
          <p className="section-copy">
            This view uses the existing FastAPI review backend. Keep the backend running on port 8010 to inspect seeded
            reports, comments, revisions, and approval history.
          </p>
        </div>
        <div className="review-toolbar__controls">
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="in_review">In review</option>
              <option value="needs_update">Needs update</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Search
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Agency, title, or report type"
            />
          </label>
        </div>
      </section>

      {error ? <p className="form-message form-message--error">{error}</p> : null}

      <div className="review-grid">
        <section className="card">
          <div className="card-header">
            <h2>Queue</h2>
            <span className="stat-badge">{reports.length} items</span>
          </div>
          {isLoadingList ? <p className="section-copy">Loading reports...</p> : null}
          {!isLoadingList && reports.length === 0 ? (
            <p className="section-copy">No reports matched the current filter.</p>
          ) : null}
          <div className="review-list">
            {reports.map((report) => (
              <button
                key={report.id}
                className={`review-list__item${report.id === selectedId ? " review-list__item--active" : ""}`}
                onClick={() => setSelectedId(report.id)}
                type="button"
              >
                <div className="review-list__row">
                  <span className="status-pill">{report.status.replace("_", " ")}</span>
                  <span>{report.priority} priority</span>
                </div>
                <h3>{report.title}</h3>
                <p>{report.summary}</p>
                <div className="review-list__row">
                  <span>{report.sourceAgency}</span>
                  <span>{report.openRevisionRequestCount} open revisions</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Report detail</h2>
            {detail ? <span className="stat-badge">v{detail.currentVersion}</span> : null}
          </div>
          {isLoadingDetail ? <p className="section-copy">Loading detail...</p> : null}
          {!isLoadingDetail && !detail ? (
            <p className="section-copy">Select a report to inspect its revision history and reviewer state.</p>
          ) : null}
          {detail ? (
            <div className="detail-stack">
              <div>
                <p className="eyebrow">
                  {detail.reportType} | {detail.sourceAgency}
                </p>
                <h3>{detail.title}</h3>
                <p className="section-copy">{detail.summary}</p>
              </div>
              <div className="detail-copy">
                <p>{detail.body}</p>
              </div>
              <div className="detail-grid">
                <div>
                  <h4>Action items</h4>
                  <ul className="detail-list">
                    {detail.actionItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Uncertainty</h4>
                  <p className="section-copy">{detail.uncertaintyNote ?? "No uncertainty note on the active version."}</p>
                </div>
              </div>
              <div className="detail-grid">
                <div>
                  <h4>Revision requests</h4>
                  <ul className="detail-list">
                    {detail.revisionRequests.map((request) => (
                      <li key={request.id}>
                        <strong>{request.requestType}</strong>: {request.body}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Comments</h4>
                  <ul className="detail-list">
                    {detail.comments.map((comment) => (
                      <li key={comment.id}>
                        <strong>{comment.authorName ?? "System"}</strong>: {comment.body}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h4>Status history</h4>
                <ul className="detail-list">
                  {detail.statusHistory.map((event) => (
                    <li key={event.id}>
                      {event.fromStatus ? `${event.fromStatus} -> ` : ""}
                      {event.toStatus}
                      {event.note ? ` | ${event.note}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
