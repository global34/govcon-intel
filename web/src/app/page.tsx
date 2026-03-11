import Link from "next/link";

import { SignupForm } from "@/components/signup-form";
import { keystaticReader } from "@/lib/keystatic-reader";
import { premiumPackages, signalPosts } from "@/lib/site-data";
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

export default async function Home() {
  const homepage = await keystaticReader.singletons.homepage.read().catch(() => null);
  const feed = await loadApprovedSignals();
  const approved = feed?.items ?? [];

  const heroEyebrow = homepage?.heroEyebrow ?? "Signal-first federal intelligence";
  const heroHeadline = homepage?.heroHeadline ?? "Veteran-owned federal intelligence built to convert readers into subscribers.";
  const heroCopy =
    homepage?.heroCopy ??
    "SDVOSBNews.com is designed to collect federal contracting signals, turn them into public-safe intelligence, and convert readers into subscribers for deeper weekly briefings and premium reports.";
  const primaryCtaLabel = homepage?.primaryCtaLabel ?? "Join the weekly brief";
  const primaryCtaHref = homepage?.primaryCtaHref ?? "/newsletter";
  const secondaryCtaLabel = homepage?.secondaryCtaLabel ?? "Open review dashboard";
  const secondaryCtaHref = homepage?.secondaryCtaHref ?? "/admin/review";

  return (
    <div className="page-frame">
      <section className="section hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">{heroEyebrow}</p>
            <h1 className="hero__title">{heroHeadline}</h1>
            <p className="hero__copy">{heroCopy}</p>
            <div className="button-row">
              <Link className="button button--primary" href={primaryCtaHref}>
                {primaryCtaLabel}
              </Link>
              <Link className="button button--secondary" href={secondaryCtaHref}>
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>
          <div className="card">
            <SignupForm source="homepage-hero" compact />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="three-up">
            <article className="card">
              <p className="stat-badge">Public</p>
              <h2>Signal posts</h2>
              <p>Short posts that prove relevance and route readers into the email list.</p>
            </article>
            <article className="card">
              <p className="stat-badge">Recurring revenue</p>
              <h2>Paid weekly briefings</h2>
              <p>Deeper, more actionable analysis for operators who need context faster.</p>
            </article>
            <article className="card">
              <p className="stat-badge">High value</p>
              <h2>Custom reports</h2>
              <p>Opportunity and teaming intelligence for active pursuit decisions.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent public-safe signals</p>
              <h2 className="section-title">Use public content to show judgment, not to give away the paid product.</h2>
            </div>
            <Link className="text-link" href="/signals">
              Browse all signals
            </Link>
          </div>
          <div className="signal-grid">
            {approved.length > 0
              ? approved.slice(0, 3).map((report) => (
                  <article className="card signal-card" key={report.id}>
                    <div className="signal-card__meta">
                      <span className="tag">{report.reportType}</span>
                      <span>{report.date}</span>
                    </div>
                    <h3>{report.title}</h3>
                    <p>{report.summary}</p>
                    <Link className="text-link" href={`/signals/${report.id}`}>
                      Read signal
                    </Link>
                  </article>
                ))
              : signalPosts.slice(0, 3).map((signal) => (
                  <article className="card signal-card" key={signal.slug}>
                    <div className="signal-card__meta">
                      <span className="tag">{signal.category}</span>
                      <span>{signal.publishedAt}</span>
                    </div>
                    <h3>{signal.title}</h3>
                    <p>{signal.summary}</p>
                    <Link className="text-link" href={`/signals/${signal.slug}`}>
                      Read signal
                    </Link>
                  </article>
                ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Product ladder</p>
              <h2 className="section-title">The site is built to convert from free signal to paid intelligence.</h2>
            </div>
            <Link className="text-link" href="/premium">
              See premium packaging
            </Link>
          </div>
          <div className="three-up">
            {premiumPackages.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
