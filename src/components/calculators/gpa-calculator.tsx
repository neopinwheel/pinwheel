"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Select } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatNumber, toNumber } from "@/lib/format";

const domain = getDomain("math")!;
const calculator = domain.calculators.find((c) => c.slug === "gpa")!;

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

type Course = { id: number; credits: string; grade: string };

let nextId = 4;

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, credits: "3", grade: "A" },
    { id: 2, credits: "4", grade: "B+" },
    { id: 3, credits: "3", grade: "A-" },
  ]);

  const addCourse = () => {
    setCourses((prev) => [...prev, { id: nextId++, credits: "3", grade: "A" }]);
  };

  const removeCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: number, patch: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const result = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    for (const course of courses) {
      const credits = toNumber(course.credits);
      const points = GRADE_POINTS[course.grade] ?? 0;
      totalCredits += credits;
      totalPoints += credits * points;
    }
    return {
      gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
      totalCredits,
      courseCount: courses.length,
    };
  }, [courses]);

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      inputs={
        <div className="space-y-3">
          <div className="mb-1 grid grid-cols-[1fr_1fr_auto] gap-3 px-1 text-xs font-medium text-foreground/45">
            <span>Course</span>
            <span>Grade</span>
            <span></span>
          </div>
          {courses.map((course, i) => (
            <div key={course.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-3">
              <input
                type="number"
                inputMode="decimal"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, { credits: e.target.value })}
                placeholder="Credits"
                aria-label={`Credits for course ${i + 1}`}
                className={`w-full rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-base text-foreground outline-none transition-colors focus:ring-2 ${domain.theme.ring}`}
              />
              <Select
                label=""
                theme={domain.theme}
                value={course.grade}
                onChange={(v) => updateCourse(course.id, { grade: v })}
              >
                {Object.keys(GRADE_POINTS).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => removeCourse(course.id)}
                aria-label="Remove course"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface text-foreground/40 transition-colors hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCourse}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-surface-border py-2.5 text-sm font-medium text-foreground/50 transition-colors hover:text-foreground cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add course
          </button>
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero label="GPA" value={formatNumber(result.gpa, 2)} theme={domain.theme} />
          <StatRow
            items={[
              { label: "Courses", value: String(result.courseCount) },
              { label: "Total credits", value: formatNumber(result.totalCredits, 0) },
            ]}
          />
        </div>
      }
    />
  );
}
