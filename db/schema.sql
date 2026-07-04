-- Roadmap tracking schema. Versioned so future revisions (v2, v3, ...)
-- can be added without losing the history of earlier plans.

CREATE TABLE IF NOT EXISTS roadmap_versions (
  id SERIAL PRIMARY KEY,
  version_label TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roadmap_phases (
  id SERIAL PRIMARY KEY,
  version_id INTEGER NOT NULL REFERENCES roadmap_versions(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  timeframe TEXT,
  summary TEXT,
  sort_order INTEGER NOT NULL,
  UNIQUE (version_id, phase_number)
);

CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER NOT NULL REFERENCES roadmap_phases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS roadmap_subtasks (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  sort_order INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_roadmap_phases_version ON roadmap_phases(version_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_phase ON roadmap_tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_subtasks_task ON roadmap_subtasks(task_id);
