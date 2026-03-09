import Link from "next/link";

import { SignupForm } from "@/components/signup-form";
import { premiumPackages, signalPosts } from "@/lib/site-data";

export default function Home() {
  return (
    <div className="page-frame">
      <section className="section hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">Signal-first federal intelligence</p>
            <h1 className="hero__title">Build an audience of veteran-owned contractors before you build the paid wall.</h1>
            <p className="hero__copy">
              SDVOSBNews.com is designed to collect federal contracting signals, turn them into public-safe intelligence,
              and convert readers into subscribers for deeper weekly briefings and premium reports.
            </p>
            <div className="button-row">
              <Link className="button button--primary" href="/newsletter">
                Join the weekly brief
              </Link>
              <Link className="button button--secondary" href="/admin/review">
                Open review dashboard
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
            {signalPosts.slice(0, 3).map((signal) => (
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
