export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Subscription {
  id: string;
  serviceName: string;
  category: string;
  monthlyCost: number;
  billingCycle: "Monthly" | "Annual" | "Weekly";
  nextPayment: string; // ISO date string
  valueRating: number; // 1-5
  payments?: Payment[]; 
}

export const CATEGORIES = [
  "Entertainment",
  "Productivity",
  "Cloud Storage",
  "Music",
  "Fitness",
  "News",
  "Food",
  "Software",
  "Health",
  "Education",
  "Other",
] as const;

export const BILLING_CYCLES = ["Monthly", "Annual", "Weekly"] as const;
