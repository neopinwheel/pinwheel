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
      },
      {
        slug: "compound-interest",
        name: "Compound Interest",
        short: "Compound Interest",
        description: "Watch contributions and compounding turn into long-term growth.",
        icon: TrendingUp,
      },
      {
        slug: "tip-split",
        name: "Tip & Bill Split",
        short: "Tip / Split",
        description: "Tip fast and split any bill evenly across a group.",
        icon: Receipt,
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
      },
      {
        slug: "calories",
        name: "Calorie & BMR",
        short: "Calories / BMR",
        description: "Daily energy needs from BMR and activity level, Mifflin-St Jeor based.",
        icon: Flame,
      },
      {
        slug: "body-fat",
        name: "Body Fat %",
        short: "Body Fat",
        description: "US Navy tape-measure method for estimated body fat percentage.",
        icon: PersonStanding,
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
      },
      {
        slug: "percentage",
        name: "Percentage Calculator",
        short: "Percentage",
        description: "Percent of a number, percent change, and reverse percentages.",
        icon: Percent,
      },
      {
        slug: "unit-converter",
        name: "Unit Converter",
        short: "Unit Converter",
        description: "Length, weight, and temperature conversions in one place.",
        icon: Ruler,
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
      },
      {
        slug: "date-diff",
        name: "Date Difference",
        short: "Date Difference",
        description: "Precise duration between any two dates, in every useful unit.",
        icon: CalendarRange,
      },
      {
        slug: "discount",
        name: "Discount & Sale Price",
        short: "Discount",
        description: "Final price, amount saved, and stacked discounts made simple.",
        icon: Tag,
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

export const totalCalculatorCount = domains.reduce(
  (sum, d) => sum + d.calculators.length,
  0
);
