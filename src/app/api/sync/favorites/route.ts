import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isValidDeviceId } from "@/lib/sync-validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const deviceId = body?.deviceId;
  const favorites = body?.favorites;

  if (!isValidDeviceId(deviceId) || !Array.isArray(favorites)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [device] = await sql`SELECT id FROM sync_devices WHERE id = ${deviceId}`;
  if (!device) {
    return NextResponse.json({ error: "Unknown deviceId" }, { status: 404 });
  }

  const hrefs = favorites.filter((h): h is string => typeof h === "string").slice(0, 200);

  await sql`DELETE FROM sync_favorites WHERE device_id = ${deviceId}`;
  for (const href of hrefs) {
    await sql`
      INSERT INTO sync_favorites (device_id, href) VALUES (${deviceId}, ${href})
      ON CONFLICT DO NOTHING
    `;
  }
  await sql`UPDATE sync_devices SET last_seen_at = now() WHERE id = ${deviceId}`;

  return NextResponse.json({ ok: true, count: hrefs.length });
}
