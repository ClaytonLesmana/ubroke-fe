// ubroke/ubroke-fe/lib/supabase.ts
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Platform-specific storage
let storage: any;

if (Platform.OS === "web") {
  storage = {
    getItem: (key: string) => {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
      }
      return null;
    },
    setItem: (key: string, value: string) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    },
    removeItem: (key: string) => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    },
  };
} else {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  storage = AsyncStorage;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});

// Types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  total_points: number;
  current_level: number;
  daily_streak: number;
  currency: string;
  age?: number;
  account_count?: number;
  assets?: number;
  liabilities?: number;
  salary?: number;
  salary_frequency?: "weekly" | "biweekly" | "monthly";
  next_pay_date?: string;
  onboarding_completed: boolean;
}

export interface OnboardingData {
  firstName?: string;
  lastName?: string;
  age?: number;
  accountCount?: number;
  assets?: number;
  liabilities?: number;
  salary?: number;
  salaryFrequency?: "weekly" | "biweekly" | "monthly";
  nextPayDate?: string;
  hasUploadedStatement?: boolean;
  hasAddedTransaction?: boolean;
}
