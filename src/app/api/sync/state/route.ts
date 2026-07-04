import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isValidDeviceId } from "@/lib/sync-validation";

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!isValidDeviceId(deviceId)) {
    return NextResponse.json({ error: "Invalid or missing deviceId" }, { status: 400 });
  }

  const [device] = await sql`SELECT id FROM sync_devices WHERE id = ${deviceId}`;
  if (!device) {
    return NextResponse.json({ error: "Unknown deviceId" }, { status: 404 });
  }

  await sql`UPDATE sync_devices SET last_seen_at = now() WHERE id = ${deviceId}`;

  const favoriteRows = await sql`
    SELECT href FROM sync_favorites WHERE device_id = ${deviceId} ORDER BY created_at
  `;
  const historyRows = await sql`
    SELECT calculator_key, params, created_at FROM sync_history
    WHERE device_id = ${deviceId}
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return NextResponse.json({
    favorites: favoriteRows.map((r) => r.href as string),
    history: historyRows.map((r) => ({
      calculatorKey: r.calculator_key as string,
      params: r.params as Record<string, string>,
      timestamp: new Date(r.created_at as string).getTime(),
    })),
  });
}
