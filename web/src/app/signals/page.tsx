import Link from "next/link";

import { signalPosts } from "@/lib/site-data";
import type { ReportFeed } from "@/lib/review-types";

const REVIEW_API_INTERNAL_BASE = process.env.REVIEW_API_INTERNAL_BASE ?? "http://127.0.0.1:8010/api";

async function loadApprovedSignals(): Promise<ReportFeed | null> {
  try {
    const upstream = new URL(`${REVIEW_API_INTERNAL_BASE}/reports`);
    upstream.searchParams.set("status", "approved");

    const response = await fetch(upstream, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as ReportFeed;
  } catch {
    return null;
  }
}

export default async function SignalsPage() {
  const feed = await loadApprovedSignals();
  const approved = feed?.items ?? [];

  return (
    <div className="page-frame">
      <section className="section section--tight">
        <div className="container">
          <p className="eyebrow">Public signal archive</p>
          <h1 className="section-title">Short signal posts built to convert readers into subscribers.</h1>
          <p className="section-copy">
            These are public-safe examples. The business model is depth behind the email list and the premium products,
            not long ungated essays.
          </p>
          <div className="signal-grid">
            {approved.length > 0
              ? approved.map((report) => (
                  <article className="card signal-card" key={report.id}>
                    <div className="signal-card__meta">
                      <span className="tag">{report.reportType}</span>
                      <span>{report.date}</span>
                    </div>
                    <h2>{report.title}</h2>
                    <p>{report.summary}</p>
                    <div className="signal-card__footer">
                      <span>{report.sourceAgency}</span>
                      <Link href={`/signals/${report.id}`}>Read signal</Link>
                    </div>
                  </article>
                ))
              : signalPosts.map((signal) => (
                  <article className="card signal-card" key={signal.slug}>
                    <div className="signal-card__meta">
                      <span className="tag">{signal.category}</span>
                      <span>{signal.publishedAt}</span>
                    </div>
                    <h2>{signal.title}</h2>
                    <p>{signal.summary}</p>
                    <div className="signal-card__footer">
                      <span>{signal.agency}</span>
                      <Link href={`/signals/${signal.slug}`}>Read signal</Link>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
