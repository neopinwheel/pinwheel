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
  PiggyBank,
  Coins,
  Baby,
  Gauge,
  GraduationCap,
  BarChart3,
  Fuel,
  Globe,
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
      {
        slug: "retirement",
        name: "Retirement Savings",
        short: "Retirement",
        description: "Project your nest egg at retirement and a sustainable withdrawal rate.",
        icon: PiggyBank,
        explainer:
          "Projects your balance to retirement using the same monthly-compounding growth as the Compound Interest calculator, then estimates a sustainable monthly income using the 4% rule — withdrawing 4% of the balance annually is a common rule of thumb for a portfolio that lasts 30+ years.",
      },
      {
        slug: "currency",
        name: "Currency Converter",
        short: "Currency",
        description: "Convert between currencies using live daily exchange rates.",
        icon: Coins,
        explainer:
          "Rates are fetched live from the Frankfurter API, which publishes the European Central Bank's daily reference rates. Rates update once per business day, so intraday market movements aren't reflected.",
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
      {
        slug: "due-date",
        name: "Pregnancy Due Date",
        short: "Due Date",
        description: "Estimated due date and current gestational age from your last period.",
        icon: Baby,
        explainer:
          "Uses Naegele's rule: due date = first day of last period + 280 days, adjusted for a cycle length other than 28 days. If you enter a conception date instead, it adds 266 days. Either way, it's an estimate — only about 5% of babies arrive on their exact due date.",
      },
      {
        slug: "heart-rate-zones",
        name: "Heart Rate Zones",
        short: "HR Zones",
        description: "Training zones for warm-up, fat burn, aerobic, and max effort.",
        icon: Gauge,
        explainer:
          "Estimated max heart rate = 220 − age. Each training zone is a percentage band of that max: 50–60% warm-up, 60–70% fat burn, 70–80% aerobic, 80–90% anaerobic, and 90–100% maximum effort.",
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
      {
        slug: "gpa",
        name: "GPA Calculator",
        short: "GPA",
        description: "Weighted grade point average from your course grades and credits.",
        icon: GraduationCap,
        explainer:
          "Each letter grade maps to a grade point (A = 4.0 down to F = 0.0). GPA is the credit-weighted average: sum(credits × grade points) ÷ sum(credits), so a 4-credit course affects your GPA twice as much as a 2-credit course.",
      },
      {
        slug: "statistics",
        name: "Statistics Calculator",
        short: "Statistics",
        description: "Mean, median, mode, and standard deviation from a list of numbers.",
        icon: BarChart3,
        explainer:
          "Mean is the sum divided by count. Median is the middle value once sorted (or the average of the two middle values). Standard deviation shown here is the sample standard deviation — it divides by (n − 1), the standard choice when your numbers are a sample rather than a full population.",
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
      {
        slug: "fuel-cost",
        name: "Fuel Cost",
        short: "Fuel Cost",
        description: "Estimate the fuel cost of a trip from distance and efficiency.",
        icon: Fuel,
        explainer:
          "Fuel needed = distance ÷ fuel efficiency (miles per gallon or liters per 100 km, depending on units). Total cost is that amount multiplied by the price per gallon or liter.",
      },
      {
        slug: "timezone",
        name: "Time Zone Converter",
        short: "Time Zone",
        description: "Convert a date and time between any two time zones.",
        icon: Globe,
        explainer:
          "The entered date and time is treated as wall-clock time in the \"from\" zone, converted to a precise instant, then reformatted for the \"to\" zone using each zone's actual UTC offset — including daylight saving — on that date.",
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
