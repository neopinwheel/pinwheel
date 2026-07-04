import { neon } from "@neondatabase/serverless";

const phaseNumber = process.argv[2];
const versionLabel = process.argv[3] ?? "v1";

if (phaseNumber === undefined) {
  console.error("Usage: node db/mark-phase-done.mjs <phase_number> [version_label]");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set (run with --env-file=.env.local)");
}

const sql = neon(process.env.DATABASE_URL);

const [phase] = await sql`
  SELECT p.id FROM roadmap_phases p
  JOIN roadmap_versions v ON v.id = p.version_id
  WHERE v.version_label = ${versionLabel} AND p.phase_number = ${Number(phaseNumber)}
`;

if (!phase) {
  console.error(`Phase ${phaseNumber} not found for version ${versionLabel}`);
  process.exit(1);
}

await sql`
  UPDATE roadmap_subtasks SET status = 'completed'
  WHERE task_id IN (SELECT id FROM roadmap_tasks WHERE phase_id = ${phase.id})
`;
await sql`UPDATE roadmap_tasks SET status = 'completed' WHERE phase_id = ${phase.id}`;
await sql`UPDATE roadmap_phases SET status = 'completed' WHERE id = ${phase.id}`;

console.log(`Phase ${phaseNumber} (${versionLabel}) marked completed.`);
