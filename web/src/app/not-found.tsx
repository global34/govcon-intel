import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-frame">
      <section className="section section--tight">
        <div className="container card empty-state">
          <p className="eyebrow">Not found</p>
          <h1>That signal does not exist in the local MVP.</h1>
          <p className="section-copy">Go back to the signal archive or the newsletter landing page.</p>
          <div className="button-row">
            <Link className="button button--primary" href="/signals">
              View signals
            </Link>
            <Link className="button button--secondary" href="/newsletter">
              Join the newsletter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
