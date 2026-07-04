import {
  Landmark,
  HeartPulse,
  Sigma,
  Sparkles,
  Home as HomeIcon,
  TrendingUp,
  Receipt,
  Activity,
  Flame,
  PersonStanding,
  Calculator as CalculatorIcon,
  Percent,
  Ruler,
  Cake,
  CalendarRange,
  Tag,
  type LucideIcon,
} from "lucide-react";

export type Theme = {
  gradient: string;
  text: string;
  glow: string;
  ring: string;
  solid: string;
  solidHover: string;
  border: string;
  chip: string;
};

export type CalculatorMeta = {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  explainer: string;
};

export type DomainMeta = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  theme: Theme;
  calculators: CalculatorMeta[];
};

export const domains: DomainMeta[] = [
  {
    slug: "finance",
    name: "Finance",
    tagline: "Money, decoded",
    description:
      "Loans, growth, and everyday bills — see the real numbers behind your money decisions.",
    icon: Landmark,
    theme: {
      gradient: "from-emerald-400 via-teal-400 to-cyan-400",
      text: "text-emerald-400",
      glow: "bg-emerald-500/20",
      ring: "focus:ring-emerald-400/50 focus:border-emerald-400/60",
      solid: "bg-emerald-500",
      solidHover: "hover:bg-emerald-400",
      border: "border-emerald-400/20",
      chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    },
    calculators: [
      {
        slug: "loan",
        name: "Loan & Mortgage",
        short: "Loan / Mortgage",
        description: "Monthly payments, total interest, and full amortization insight.",
        icon: HomeIcon,
        explainer:
          "Monthly payment uses the standard amortization formula: M = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the principal, r is the monthly interest rate, and n is the number of payments. Interest is recalculated on the remaining balance each month, so more of each payment goes toward principal over time.",
      },
      {
        slug: "compound-interest",
        name: "Compound Interest",
        short: "Compound Interest",
        description: "Watch contributions and compounding turn into long-term growth.",
        icon: TrendingUp,
        explainer:
          "Each month, the balance earns interest at the monthly-equivalent rate for your chosen compounding frequency, then your contribution is added: balance = balance × (1 + r) + contribution. Small differences in compounding frequency add up meaningfully over long time horizons.",
      },
      {
        slug: "tip-split",
        name: "Tip & Bill Split",
        short: "Tip / Split",
        description: "Tip fast and split any bill evenly across a group.",
        icon: Receipt,
        explainer:
          "Tip = bill × tip%. The total (bill + tip) is then divided evenly by the number of people, so everyone pays the same share regardless of what they individually ordered.",
      },
    ],
  },
  {
    slug: "health",
    name: "Health",
    tagline: "Know your body",
    description:
      "Quick, judgment-free numbers for fitness tracking — BMI, energy needs, and composition.",
    icon: HeartPulse,
    theme: {
      gradient: "from-rose-400 via-pink-400 to-fuchsia-400",
      text: "text-rose-400",
      glow: "bg-rose-500/20",
      ring: "focus:ring-rose-400/50 focus:border-rose-400/60",
      solid: "bg-rose-500",
      solidHover: "hover:bg-rose-400",
      border: "border-rose-400/20",
      chip: "bg-rose-400/10 text-rose-300 border-rose-400/20",
    },
    calculators: [
      {
        slug: "bmi",
        name: "BMI Calculator",
        short: "BMI",
        description: "Body mass index with metric or imperial units, at a glance.",
        icon: Activity,
        explainer:
          "BMI = weight (kg) ÷ height (m)². It's a simple ratio, not a body composition measurement — the same BMI can reflect very different amounts of muscle versus fat, which is why it's shown alongside a healthy-range band rather than a single target number.",
      },
      {
        slug: "calories",
        name: "Calorie & BMR",
        short: "Calories / BMR",
        description: "Daily energy needs from BMR and activity level, Mifflin-St Jeor based.",
        icon: Flame,
        explainer:
          "BMR uses the Mifflin-St Jeor equation: 10 × weight(kg) + 6.25 × height(cm) − 5 × age, +5 for men or −161 for women. Multiplying by an activity factor (1.2–1.9) estimates total daily calories burned (TDEE).",
      },
      {
        slug: "body-fat",
        name: "Body Fat %",
        short: "Body Fat",
        description: "US Navy tape-measure method for estimated body fat percentage.",
        icon: PersonStanding,
        explainer:
          "Estimated with the U.S. Navy tape-measure method, which relates body fat to the logarithm of waist, neck (and hip, for women) measurements relative to height. It's a field estimate, not a lab measurement like DEXA.",
      },
    ],
  },
  {
    slug: "math",
    name: "Math & Science",
    tagline: "Numbers, precisely",
    description:
      "From quick arithmetic to unit conversions — the reliable toolbox for exact answers.",
    icon: Sigma,
    theme: {
      gradient: "from-indigo-400 via-violet-400 to-purple-400",
      text: "text-indigo-400",
      glow: "bg-indigo-500/20",
      ring: "focus:ring-indigo-400/50 focus:border-indigo-400/60",
      solid: "bg-indigo-500",
      solidHover: "hover:bg-indigo-400",
      border: "border-indigo-400/20",
      chip: "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",
    },
    calculators: [
      {
        slug: "scientific",
        name: "Scientific Calculator",
        short: "Scientific",
        description: "A full-featured calculator with trig, logs, powers, and memory.",
        icon: CalculatorIcon,
        explainer:
          "Trig functions (sin, cos, tan) use whichever angle mode — DEG or RAD — is selected above the display. Results are rounded to 12 significant digits to avoid floating-point artifacts like 0.1 + 0.2 showing extra trailing digits.",
      },
      {
        slug: "percentage",
        name: "Percentage Calculator",
        short: "Percentage",
        description: "Percent of a number, percent change, and reverse percentages.",
        icon: Percent,
        explainer:
          "Three common percentage questions in one place: X% of Y is X ÷ 100 × Y; percentage change from one value to another is (new − old) ÷ |old| × 100; and what percent a part is of a whole is part ÷ whole × 100.",
      },
      {
        slug: "unit-converter",
        name: "Unit Converter",
        short: "Unit Converter",
        description: "Length, weight, and temperature conversions in one place.",
        icon: Ruler,
        explainer:
          "Length and weight conversions go through a common base unit (meters or kilograms), so any two units convert via one multiplication. Temperature isn't linear the same way, so it converts through Celsius using each scale's own formula.",
      },
    ],
  },
  {
    slug: "everyday",
    name: "Everyday",
    tagline: "Life, calculated",
    description:
      "The small calculations that come up constantly — dates, ages, and deals.",
    icon: Sparkles,
    theme: {
      gradient: "from-amber-400 via-orange-400 to-red-400",
      text: "text-amber-400",
      glow: "bg-amber-500/20",
      ring: "focus:ring-amber-400/50 focus:border-amber-400/60",
      solid: "bg-amber-500",
      solidHover: "hover:bg-amber-400",
      border: "border-amber-400/20",
      chip: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    },
    calculators: [
      {
        slug: "age",
        name: "Age Calculator",
        short: "Age",
        description: "Exact age in years, months, days — and days until your next birthday.",
        icon: Cake,
        explainer:
          "Age is calculated as a true calendar difference — years, months, and days between your birth date and the reference date — not just total days divided by 365, so it stays accurate across leap years and varying month lengths.",
      },
      {
        slug: "date-diff",
        name: "Date Difference",
        short: "Date Difference",
        description: "Precise duration between any two dates, in every useful unit.",
        icon: CalendarRange,
        explainer:
          "Calculates the exact calendar span between two dates in years, months, and days — the same calendar-aware method as the Age calculator — plus total days and weeks for quick reference.",
      },
      {
        slug: "discount",
        name: "Discount & Sale Price",
        short: "Discount",
        description: "Final price, amount saved, and stacked discounts made simple.",
        icon: Tag,
        explainer:
          "Each discount applies to the price after the previous one, not the original price — so two 20% discounts stacked together save 36% overall, not 40%.",
      },
    ],
  },
];

export function getDomain(slug: string) {
  return domains.find((d) => d.slug === slug);
}

export function getCalculator(domainSlug: string, calcSlug: string) {
  const domain = getDomain(domainSlug);
  const calculator = domain?.calculators.find((c) => c.slug === calcSlug);
  return domain && calculator ? { domain, calculator } : undefined;
}

export function getCalculatorByHref(href: string) {
  const [, domainSlug, calcSlug] = href.split("/");
  return getCalculator(domainSlug, calcSlug);
}

export const totalCalculatorCount = domains.reduce(
  (sum, d) => sum + d.calculators.length,
  0
);
