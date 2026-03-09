import { ReviewDashboard } from "@/components/review-dashboard";

export default function AdminReviewPage() {
  return (
    <div className="page-frame">
      <section className="section section--tight">
        <div className="container">
          <ReviewDashboard />
        </div>
      </section>
    </div>
  );
}
