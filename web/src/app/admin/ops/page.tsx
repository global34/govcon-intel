import { opsHighlights } from "@/lib/site-data";

const capabilityRows = [
  { capability: "Newsletter capture endpoint", owner: "Frontend + Growth", status: "Ready" },
  { capability: "Review backend", owner: "Backend", status: "Ready" },
  { capability: "Public CMS publishing endpoint", owner: "Backend", status: "Missing" },
  { capability: "Email delivery provider", owner: "Growth + Backend", status: "Missing" },
  { capability: "Analytics event pipeline", owner: "Frontend", status: "In build" },
  { capability: "Browser automation collector", owner: "LangGraph workers", status: "In design" },
];

export default function AdminOpsPage() {
  return (
    <div className="page-frame">
      <section className="section section--tight">
        <div className="container">
          <p className="eyebrow">Operations control plane</p>
          <h1 className="section-title">Show the company state separately from the workflow state.</h1>
          <p className="section-copy">
            Paperclip should manage these views. For the local MVP, this route acts as the operating model dashboard and
            capability-gap register.
          </p>
          <div className="three-up">
            {opsHighlights.map((item) => (
              <article className="card" key={item.title}>
                <p className="stat-badge">{item.status}</p>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="card capability-table">
            <div className="card-header">
              <h2>Capability gaps</h2>
              <span className="stat-badge">Resume blocked runs only after verify</span>
            </div>
            <div className="capability-table__rows">
              {capabilityRows.map((row) => (
                <div className="capability-table__row" key={row.capability}>
                  <strong>{row.capability}</strong>
                  <span>{row.owner}</span>
                  <span className={`status-pill status-pill--${row.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
