import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://rfjuyimkymldbzhpuldf.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanV5aW1reW1sZGJ6aHB1bGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTE2MDMsImV4cCI6MjA3MTE4NzYwM30.JDujXndGB948c8QfXoZrYpYiB7XrB290pl7jupfMqUI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
