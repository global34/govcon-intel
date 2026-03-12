import { keystaticReader } from "@/lib/keystatic-reader";
import type { ReportDetail, ReportFeed } from "@/lib/review-types";

export type CmsSignalEntry = {
  title: string;
  date: string;
  summary: string;
  category: string;
  content: () => Promise<any>;
};

export type CmsSignalSummary = {
  source: "cms";
  slug: string;
  title: string;
  date: string;
  summary: string;
  tag: string;
};

export type ReviewSignalSummary = {
  source: "review";
  slug: string;
  title: string;
  date: string;
  summary: string;
  tag: string;
  sourceAgency: string;
};

export type PublicSignalSummary = CmsSignalSummary | ReviewSignalSummary;

const REVIEW_API_INTERNAL_BASE =
  process.env.REVIEW_API_INTERNAL_BASE ?? "http://127.0.0.1:8010/api";

export async function listCmsSignals(): Promise<CmsSignalSummary[]> {
  const slugs = await keystaticReader.collections.signals.list().catch(() => []);
  const entries: CmsSignalSummary[] = [];

  for (const slug of slugs) {
    const entry = await keystaticReader.collections.signals.read(slug).catch(() => null);
    if (!entry) continue;
    entries.push({
      source: "cms",
      slug,
      title: entry.title,
      date: entry.date,
      summary: entry.summary ?? "",
      tag: entry.category,
    });
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function readCmsSignal(slug: string): Promise<(CmsSignalEntry & { slug: string }) | null> {
  const entry = await keystaticReader.collections.signals.read(slug).catch(() => null);
  if (!entry) return null;
  return { slug, ...entry } as unknown as CmsSignalEntry & { slug: string };
}

export async function listApprovedReviewSignals(): Promise<ReviewSignalSummary[]> {
  try {
    const upstream = new URL(`${REVIEW_API_INTERNAL_BASE}/reports`);
    upstream.searchParams.set("status", "approved");

    const response = await fetch(upstream, { cache: "no-store" });
    if (!response.ok) return [];
    const feed = (await response.json()) as ReportFeed;
    const items = feed.items ?? [];

    return items
      .map((report) => ({
        source: "review" as const,
        slug: report.id,
        title: report.title,
        date: report.date,
        summary: report.summary,
        tag: report.reportType,
        sourceAgency: report.sourceAgency,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function readApprovedReviewSignal(id: string): Promise<ReportDetail | null> {
  try {
    const response = await fetch(`${REVIEW_API_INTERNAL_BASE}/reports/${id}`, { cache: "no-store" });
    if (!response.ok) return null;
    const detail = (await response.json()) as ReportDetail;
    if (detail.status !== "approved") return null;
    return detail;
  } catch {
    return null;
  }
}

export async function listPublicSignals(): Promise<PublicSignalSummary[]> {
  const [cms, review] = await Promise.all([listCmsSignals(), listApprovedReviewSignals()]);

  const deduped = new Map<string, PublicSignalSummary>();
  for (const item of review) deduped.set(item.slug, item);
  for (const item of cms) deduped.set(item.slug, item); // CMS wins on collision

  return Array.from(deduped.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
