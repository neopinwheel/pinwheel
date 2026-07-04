import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set (run with --env-file=.env.local)");
}

const sql = neon(process.env.DATABASE_URL);

const VERSION = {
  label: "v1",
  name: "Pinwheel roadmap — v1",
  description:
    "Phased plan from the competitive landscape & gap analysis memo: quick wins, personalization, trust & clarity, visual differentiation, breadth, and power & platform.",
};

const PHASES = [
  {
    number: 0,
    title: "Quick wins",
    timeframe: "days · no schema",
    summary: "Closes the most-felt gaps with zero backend work.",
    tasks: [
      {
        title: "Cross-calculator search (⌘K)",
        description: "Fuzzy search over all 12 calculators from anywhere in the app.",
        subtasks: [
          "Build a searchable index from the existing domains/calculators config",
          "Build the command palette UI (input, results list, keyboard nav)",
          "Wire the Cmd+K / Ctrl+K global shortcut",
          "Add a visible search trigger button in the site header",
        ],
      },
      {
        title: "Shareable results via URL params",
        description: "Every calculation becomes a link that reproduces the same result.",
        subtasks: [
          "Define a query-param schema per calculator (inputs only, no derived state)",
          "Read initial state from the URL on load for each calculator",
          "Sync state to the URL as inputs change (shallow route update)",
          "Add a 'Copy link' action to the results panel",
        ],
      },
      {
        title: "Copy / native share button on results",
        description: "One-tap sharing of a calculation's result text.",
        subtasks: [
          "Build a ShareButton component (Web Share API with clipboard fallback)",
          "Format a short shareable summary string per calculator type",
          "Add the button to the shared CalculatorShell results panel",
        ],
      },
      {
        title: "PWA manifest + installability",
        description: "Pinwheel installs to a home screen like a native app.",
        subtasks: [
          "Create manifest.json with name, colors, and icon set (192/512)",
          "Generate app icons matching the existing brand mark",
          "Link the manifest and theme-color meta tag in the root layout",
          "Add a minimal service worker for static asset caching",
        ],
      },
    ],
  },
  {
    number: 1,
    title: "Personalize",
    timeframe: "~1 week",
    summary:
      "Start with localStorage — matches the privacy-first story and needs no account. Promote to the connected Neon Postgres only as an opt-in sync layer.",
    tasks: [
      {
        title: "Per-calculator history",
        description: "Revisit or restore recent runs of any calculator.",
        subtasks: [
          "Design a history entry shape (calculator id, inputs, result, timestamp)",
          "Build a useCalculatorHistory hook backed by localStorage",
          "Add a 'Recent' panel to each calculator page",
          "Add restore and clear-history actions",
        ],
      },
      {
        title: "Favorites / pinned calculators",
        description: "Surface the calculators someone actually uses.",
        subtasks: [
          "Build a useFavorites hook backed by localStorage",
          "Add a pin/star toggle to calculator cards",
          "Add a 'Favorites' section to the home page",
        ],
      },
      {
        title: "Optional cross-device sync",
        description: "Opt-in sync using the already-connected Neon database.",
        subtasks: [
          "Design the users/sessions and saved_calculations tables",
          "Add lightweight anonymous auth (device id or magic link)",
          "Build API routes to push/pull history and favorites",
          "Add an opt-in 'Sync across devices' toggle in settings",
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Trust & clarity",
    timeframe: "~1-2 weeks",
    summary: "Borrow what Omni and CalculatorSoup get right, without the SEO sprawl.",
    tasks: [
      {
        title: "Formula explainer per calculator",
        description: "A few sentences of 'how this is calculated', not an article.",
        subtasks: [
          "Write concise formula copy for each of the 12 calculators",
          "Build a shared ExplainerCard component",
          "Insert the explainer into each calculator page's result panel",
        ],
      },
      {
        title: "SEO metadata & Open Graph tags",
        description: "Each page describes itself properly when shared or indexed.",
        subtasks: [
          "Add per-page meta descriptions",
          "Design and generate an Open Graph image template",
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Visual differentiation",
    timeframe: "~1-2 weeks",
    summary: "The data already exists — this phase just draws it.",
    tasks: [
      {
        title: "Amortization schedule chart",
        description: "Visualize the loan calculator's payment breakdown over time.",
        subtasks: [
          "Install a charting library (recharts)",
          "Compute the full amortization schedule dataset",
          "Build an AmortizationChart component matching Pinwheel's theme",
          "Integrate the chart into the Loan calculator's results",
        ],
      },
      {
        title: "Growth curve chart",
        description: "Visualize compound interest balance growth over time.",
        subtasks: [
          "Compute a year-by-year balance series",
          "Build a GrowthChart component",
          "Integrate the chart into the Compound Interest calculator",
        ],
      },
      {
        title: "Scenario comparison",
        description: "Side-by-side what-if comparison, a lighter Simplifi-style feature.",
        subtasks: [
          "Design a two-column comparison UI for inputs and results",
          "Add a 'Compare' toggle to the Loan and Compound Interest calculators",
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Breadth",
    timeframe: "ongoing",
    summary: "Fill each domain to 5-6 calculators, prioritizing the clearest whitespace.",
    tasks: [
      {
        title: "Finance: Retirement Savings calculator",
        description: "Whitespace identified in the gap analysis.",
        subtasks: [
          "Define the retirement savings formula and inputs",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
      {
        title: "Finance: Currency Converter (live rates)",
        description: "Whitespace identified in the gap analysis.",
        subtasks: [
          "Choose and integrate a live exchange-rate API",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
      {
        title: "Health: Pregnancy Due Date calculator",
        description: "Whitespace identified in the gap analysis.",
        subtasks: [
          "Define the due-date estimation formula and inputs",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
      {
        title: "Health: Heart Rate Zones calculator",
        description: "Whitespace identified in the gap analysis.",
        subtasks: [
          "Define the heart-rate zone formula and inputs",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
      {
        title: "Math & Science: GPA Calculator",
        description: "Whitespace identified in the gap analysis.",
        subtasks: [
          "Define grade-to-point mapping and weighting logic",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
      {
        title: "Math & Science: Statistics Calculator",
        description: "Mean, median, mode, standard deviation.",
        subtasks: [
          "Implement core statistics functions",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
      {
        title: "Everyday: Fuel Cost Calculator",
        description: "Whitespace identified in the gap analysis.",
        subtasks: [
          "Define the fuel cost formula and inputs",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
      {
        title: "Everyday: Time Zone Converter",
        description: "Whitespace identified in the gap analysis.",
        subtasks: [
          "Handle time zone conversion and DST correctly",
          "Build the calculator component",
          "Add the route page and register it in the domain config",
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Power & platform",
    timeframe: "later",
    summary: "Longer-term investments once the fundamentals above are in place.",
    tasks: [
      {
        title: "RPN mode for the scientific calculator",
        description: "Power-user mode matching PCalc's reference bar.",
        subtasks: [
          "Design RPN stack-based input model",
          "Add a mode toggle (standard / RPN) to the scientific calculator",
        ],
      },
      {
        title: "Programmer mode (binary / hex / octal)",
        description: "Power-user mode matching PCalc's reference bar.",
        subtasks: [
          "Add base conversion and bitwise operations",
          "Add a programmer-mode UI variant",
        ],
      },
      {
        title: "Full offline support",
        description: "Every calculator works with no network connection.",
        subtasks: [
          "Define a service worker caching strategy for all routes",
          "Test full offline usage end-to-end",
        ],
      },
      {
        title: "Optional lightweight accounts",
        description: "Cross-device sync building on the Phase 1 opt-in sync layer.",
        subtasks: [
          "Finalize auth approach (magic link vs. passkey)",
          "Migrate opt-in sync users to full account records",
        ],
      },
    ],
  },
];

async function main() {
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log("Schema ensured.");

  const [existing] = await sql`
    SELECT id FROM roadmap_versions WHERE version_label = ${VERSION.label}
  `;
  if (existing) {
    console.log(`Version ${VERSION.label} already exists (id=${existing.id}) — removing to reseed.`);
    await sql`DELETE FROM roadmap_versions WHERE id = ${existing.id}`;
  }

  const [version] = await sql`
    INSERT INTO roadmap_versions (version_label, name, description)
    VALUES (${VERSION.label}, ${VERSION.name}, ${VERSION.description})
    RETURNING id
  `;
  console.log(`Created version ${VERSION.label} (id=${version.id})`);

  let phaseOrder = 0;
  for (const phase of PHASES) {
    const [phaseRow] = await sql`
      INSERT INTO roadmap_phases (version_id, phase_number, title, timeframe, summary, sort_order)
      VALUES (${version.id}, ${phase.number}, ${phase.title}, ${phase.timeframe}, ${phase.summary}, ${phaseOrder})
      RETURNING id
    `;
    phaseOrder += 1;

    let taskOrder = 0;
    for (const task of phase.tasks) {
      const [taskRow] = await sql`
        INSERT INTO roadmap_tasks (phase_id, title, description, sort_order)
        VALUES (${phaseRow.id}, ${task.title}, ${task.description}, ${taskOrder})
        RETURNING id
      `;
      taskOrder += 1;

      let subtaskOrder = 0;
      for (const subtaskTitle of task.subtasks) {
        await sql`
          INSERT INTO roadmap_subtasks (task_id, title, sort_order)
          VALUES (${taskRow.id}, ${subtaskTitle}, ${subtaskOrder})
        `;
        subtaskOrder += 1;
      }
    }
    console.log(`  Phase ${phase.number} — ${phase.title}: ${phase.tasks.length} tasks`);
  }

  const [counts] = await sql`
    SELECT
      (SELECT count(*) FROM roadmap_phases WHERE version_id = ${version.id}) AS phases,
      (SELECT count(*) FROM roadmap_tasks t JOIN roadmap_phases p ON t.phase_id = p.id WHERE p.version_id = ${version.id}) AS tasks,
      (SELECT count(*) FROM roadmap_subtasks s JOIN roadmap_tasks t ON s.task_id = t.id JOIN roadmap_phases p ON t.phase_id = p.id WHERE p.version_id = ${version.id}) AS subtasks
  `;
  console.log("Totals:", counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
