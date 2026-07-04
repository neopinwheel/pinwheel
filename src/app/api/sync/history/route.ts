import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isValidDeviceId } from "@/lib/sync-validation";

const MAX_ENTRIES_PER_DEVICE = 50;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const deviceId = body?.deviceId;
  const calculatorKey = body?.calculatorKey;
  const params = body?.params;

  if (
    !isValidDeviceId(deviceId) ||
    typeof calculatorKey !== "string" ||
    typeof params !== "object" ||
    params === null
  ) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [device] = await sql`SELECT id FROM sync_devices WHERE id = ${deviceId}`;
  if (!device) {
    return NextResponse.json({ error: "Unknown deviceId" }, { status: 404 });
  }

  await sql`
    INSERT INTO sync_history (device_id, calculator_key, params)
    VALUES (${deviceId}, ${calculatorKey}, ${JSON.stringify(params)})
  `;

  await sql`
    DELETE FROM sync_history
    WHERE device_id = ${deviceId}
    AND id NOT IN (
      SELECT id FROM sync_history
      WHERE device_id = ${deviceId}
      ORDER BY created_at DESC
      LIMIT ${MAX_ENTRIES_PER_DEVICE}
    )
  `;

  await sql`UPDATE sync_devices SET last_seen_at = now() WHERE id = ${deviceId}`;

  return NextResponse.json({ ok: true });
}
