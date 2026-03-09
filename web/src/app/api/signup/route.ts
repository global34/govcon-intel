import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

type SignupPayload = {
  email?: string;
  firstName?: string;
  company?: string;
  source?: string;
  interests?: string[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_PATH = path.join(DATA_DIR, "subscribers.json");

export async function POST(request: Request) {
  const payload = (await request.json()) as SignupPayload;
  const email = payload.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  await fs.mkdir(DATA_DIR, { recursive: true });

  const currentRecords = await readSubscribers();
  const existingRecord = currentRecords.find((record) => record.email === email);

  if (existingRecord) {
    return NextResponse.json({ message: "This address is already subscribed locally." });
  }

  const nextRecord = {
    email,
    firstName: payload.firstName?.trim() || null,
    company: payload.company?.trim() || null,
    source: payload.source?.trim() || "unknown",
    interests: Array.isArray(payload.interests) ? payload.interests : [],
    createdAt: new Date().toISOString(),
  };

  currentRecords.push(nextRecord);
  await fs.writeFile(SUBSCRIBERS_PATH, JSON.stringify(currentRecords, null, 2));

  return NextResponse.json({ message: "Subscription captured in the local MVP store." });
}

async function readSubscribers() {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_PATH, "utf8");
    return JSON.parse(raw) as Array<Record<string, unknown> & { email: string }>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}
