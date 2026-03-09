import { SignupForm } from "@/components/signup-form";

export default function NewsletterPage() {
  return (
    <div className="page-frame">
      <section className="section hero hero--compact">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">Newsletter funnel</p>
            <h1 className="hero__title">Federal market signals for teams that need to move before the bid gets crowded.</h1>
            <p className="hero__copy">
              Subscribe to the weekly SDVOSBNews brief for opportunity movement, compliance shifts, budget signals, and
              teaming patterns that affect veteran-owned contractors.
            </p>
            <ul className="detail-list">
              <li>Weekly signal brief with practical next steps</li>
              <li>Topic selection for opportunities, compliance, budget, and teaming</li>
              <li>Future upgrade path into premium intelligence and custom reports</li>
            </ul>
          </div>
          <div className="card">
            <SignupForm source="newsletter-page" />
          </div>
        </div>
      </section>
    </div>
  );
}
