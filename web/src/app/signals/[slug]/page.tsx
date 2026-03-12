import Link from "next/link";
import { notFound } from "next/navigation";

import { signalPosts } from "@/lib/site-data";
import { readApprovedReviewSignal, readCmsSignal } from "@/lib/public-signals";

type SignalDetailPageProps = {
  params: Promise<{ slug: string }>;
};

import Markdoc from "@markdoc/markdoc";
import React from "react";

export default async function SignalDetailPage({ params }: SignalDetailPageProps) {
  const { slug } = await params;

  const approved = await readApprovedReviewSignal(slug);
  if (approved) {
    return (
      <div className="page-frame">
        <section className="section section--tight">
          <div className="container detail-layout">
            <div className="detail-layout__main">
              <p className="eyebrow">
                {approved.reportType} | {approved.sourceAgency}
              </p>
              <h1 className="section-title">{approved.title}</h1>
              <p className="section-copy">{approved.summary}</p>
              <div className="detail-copy">
                <pre className="markdown-pre">{approved.body}</pre>
              </div>
              <Link className="button button--primary" href="/newsletter">
                Get the weekly brief
              </Link>
            </div>
            <aside className="card detail-layout__aside">
              <h2>Why this exists</h2>
              <p>
                Public signals prove relevance quickly. The paid product is the deeper context, timing, and recommended
                action.
              </p>
              <ul className="detail-list">
                <li>Public signal: high-level market movement</li>
                <li>Newsletter: recurring decision support</li>
                <li>Premium: earlier warning and richer analysis</li>
              </ul>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  const cms = await readCmsSignal(slug);
  if (cms) {
    const document = await cms.content();
    const node = (document as any)?.node ?? document;
    const renderable = Markdoc.transform(node);

    return (
      <div className="page-frame">
        <section className="section section--tight">
          <div className="container detail-layout">
            <div className="detail-layout__main">
              <p className="eyebrow">{cms.category}</p>
              <h1 className="section-title">{cms.title}</h1>
              <p className="section-copy">{cms.summary}</p>
              <div className="detail-copy">
                {Markdoc.renderers.react(renderable, React)}
              </div>
              <Link className="button button--primary" href="/newsletter">
                Get the weekly brief
              </Link>
            </div>
            <aside className="card detail-layout__aside">
              <h2>Why this exists</h2>
              <p>
                Public signals prove relevance quickly. The paid product is the deeper context, timing, and recommended
                action.
              </p>
              <ul className="detail-list">
                <li>Public signal: high-level market movement</li>
                <li>Newsletter: recurring decision support</li>
                <li>Premium: earlier warning and richer analysis</li>
              </ul>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  const signal = signalPosts.find((item) => item.slug === slug);

  if (!signal) {
    notFound();
  }

  return (
    <div className="page-frame">
      <section className="section section--tight">
        <div className="container detail-layout">
          <div className="detail-layout__main">
            <p className="eyebrow">
              {signal.category} | {signal.agency}
            </p>
            <h1 className="section-title">{signal.title}</h1>
            <p className="section-copy">{signal.summary}</p>
            <div className="detail-copy">
              <p>{signal.whyItMatters}</p>
              <p>{signal.premiumAngle}</p>
            </div>
            <Link className="button button--primary" href="/newsletter">
              Get the weekly brief
            </Link>
          </div>
          <aside className="card detail-layout__aside">
            <h2>Why this exists</h2>
            <p>
              Public signals prove relevance quickly. The paid product is the deeper context, timing, and recommended
              action.
            </p>
            <ul className="detail-list">
              <li>Public signal: high-level market movement</li>
              <li>Newsletter: recurring decision support</li>
              <li>Premium: earlier warning and richer analysis</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
