import { NextResponse } from "next/server";

import type { ReportDetail } from "@/lib/review-types";

const REVIEW_API_INTERNAL_BASE = process.env.REVIEW_API_INTERNAL_BASE ?? "http://127.0.0.1:8010/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const upstream = `${REVIEW_API_INTERNAL_BASE}/reports/${encodeURIComponent(id)}`;

  try {
    const response = await fetch(upstream, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const body = (await response.json()) as ReportDetail;
    if (body.status !== "approved") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json(body, { status: 200 });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}

