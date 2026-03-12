import Link from "next/link";

import { signalPosts } from "@/lib/site-data";
import { listPublicSignals } from "@/lib/public-signals";

export default async function SignalsPage() {
  const items = await listPublicSignals();

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
            {items.length > 0
              ? items.map((item) => (
                  <article className="card signal-card" key={`${item.source}:${item.slug}`}>
                    <div className="signal-card__meta">
                      <span className="tag">{item.tag}</span>
                      <span>{item.date}</span>
                    </div>
                    <h2>{item.title}</h2>
                    <p>{item.summary}</p>
                    <div className="signal-card__footer">
                      {"sourceAgency" in item ? <span>{item.sourceAgency}</span> : <span />}
                      <Link href={`/signals/${item.slug}`}>Read signal</Link>
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
