import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Dropdown options for the category field
export const CATEGORY_OPTIONS = [
  "Business Inquiry",
  "Partnership",
  "Investment",
  "Consultation",
  "Support",
  "Other"
] as const;

// User submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  assignedTo: text("assigned_to").notNull().default("Desuru Reddy"),
  category: text("category").notNull(),
  otherCategory: text("other_category"),
  state: text("state").notNull(),
  county: text("county").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  category: z.string().min(1, "Please select a category"),
  state: z.string().min(2, "State is required"),
  county: z.string().min(2, "County is required"),
  otherCategory: z.string().optional(),
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Grouped submissions type for admin dashboard
export type GroupedSubmissions = {
  category: string;
  submissions: Submission[];
  count: number;
};
