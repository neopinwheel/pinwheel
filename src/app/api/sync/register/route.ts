import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sql } from "@/lib/db";

export async function POST() {
  const deviceId = randomUUID();
  await sql`INSERT INTO sync_devices (id) VALUES (${deviceId})`;
  return NextResponse.json({ deviceId });
}
