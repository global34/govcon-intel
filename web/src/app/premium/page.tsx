import Link from "next/link";

import { premiumPackages } from "@/lib/site-data";

export default function PremiumPage() {
  return (
    <div className="page-frame">
      <section className="section section--tight">
        <div className="container">
          <p className="eyebrow">Premium intelligence</p>
          <h1 className="section-title">Offer the depth only after the audience trusts the signal quality.</h1>
          <p className="section-copy">
            The local MVP uses a waitlist posture. The product surface is ready; payment and entitlement should follow
            once positioning and operations are locked.
          </p>
          <div className="three-up">
            {premiumPackages.map((item) => (
              <article className="card" key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="cta-strip">
            <div>
              <p className="cta-strip__title">Current conversion path</p>
              <p className="section-copy">
                Public signal to newsletter to premium waitlist to paid weekly briefing or custom report.
              </p>
            </div>
            <Link className="button button--primary" href="/newsletter">
              Join the waitlist via newsletter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
