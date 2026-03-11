import { NextResponse } from "next/server";

import type { ReportFeed } from "@/lib/review-types";

const REVIEW_API_INTERNAL_BASE = process.env.REVIEW_API_INTERNAL_BASE ?? "http://127.0.0.1:8010/api";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const limit = requestUrl.searchParams.get("limit");

  const upstream = new URL(`${REVIEW_API_INTERNAL_BASE}/reports`);
  upstream.searchParams.set("status", "approved");
  if (limit) {
    upstream.searchParams.set("limit", limit);
  }

  try {
    const response = await fetch(upstream, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const empty: ReportFeed = { items: [], total: 0 };
      return NextResponse.json(empty, { status: 200 });
    }

    const body = (await response.json()) as ReportFeed;
    return NextResponse.json(body, { status: 200 });
  } catch {
    const empty: ReportFeed = { items: [], total: 0 };
    return NextResponse.json(empty, { status: 200 });
  }
}

