import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Dropdown options for the lineage (vaaru) field - alphabetically sorted
export const LINEAGE_OPTIONS = [
  "Agastya Reddy Vaaru",
  "Aluru Vaaru",
  "Baba Reddy Vaaru",
  "Babbai Reddy Vaaru",
  "Babbula Veluru Vaaru",
  "Bairam Reddy Vaaru",
  "Channa Reddy Vaaru",
  "Chenna Reddy Vaaru",
  "Chillakuru Vaaru",
  "Chintham Reddy Vaaru",
  "Deva Reddy Vaaru",
  "Dupalli Reddy Vaaru",
  "Duvvuru Vaaru",
  "Ee Ooru Vaaru",
  "Eeshwaraga Vaaru",
  "Gandavaram Vaaru",
  "Gangapuram Vaaru",
  "Goduru Vaaru",
  "Guduru Vaaru",
  "Gundala Reddy",
  "Gundala Vaaru",
  "Jettam Kiva Vaaru",
  "Kakarla Vaaru",
  "Kala Kandara Vaaru",
  "Kami Reddy",
  "Kami Reddy Vaaru",
  "Kapuru Vaaru",
  "Kasi Reddy Vaaru",
  "Katam Reddy Vaaru",
  "Katavettu Vaaru",
  "Kavali Reddy Vaaru",
  "Kesa Reddy Vaaru",
  "Kolam Reddy Vaaru",
  "Kota Maaru",
  "Kotavaru Vaaru",
  "Krishna Reddy Vaaru",
  "Linga Reddy Vaaru",
  "Maasi Reddy",
  "Malampattu Vaaru",
  "Malla Varapu Vaaru",
  "Maram Reddy Vaaru",
  "Moulali Reddy",
  "Mulukuri Vaaru",
  "Naga Reddy Vaaru",
  "Nagalapuram Vaaru",
  "Nagayettu Vaaru",
  "Nalla Reddy Vaaru",
  "Nelavaya Vaaru",
  "Nelli Gudi Vaaru",
  "Oduru Vaaru",
  "Padala Vaaru",
  "Pallam Reddy Vaaru",
  "Pallettu Vaaru",
  "Pandya Reddy Vaaru",
  "Parvatha Reddy Vaaru",
  "Pasivi Reddy Vaaru",
  "Pathrathi Vaaru",
  "Pebbai Reddy",
  "Pelluru Vaaru",
  "Pemma Reddy Vaaru",
  "Penu Malli Vaaru",
  "Petta Vaaru",
  "Pinnala Reddy Vaaru",
  "Posa Reddy Vaaru",
  "Rama Reddy Vaaru",
  "Rami Reddy Vaaru",
  "Ravuru Vaaru",
  "Sarva Reddy Vaaru",
  "Sathamadu Vaaru",
  "Seepa Reddy",
  "Sowjanya Vaaru",
  "Tanguturi Vaaru",
  "Uppathi Reddy Vaaru",
  "Uppula Veluru Vaaru",
  "Vagati Vaaru",
  "Varada Reddy Vaaru",
  "Velavaya Vaaru",
  "Vema Reddy Vaaru",
  "Venkuru Vaaru",
  "Vetturu Vaaru",
  "Other"
] as const;

// User submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  community: text("community").notNull().default("Desuru Reddy"),
  lineage: text("lineage").notNull(),
  otherLineage: text("other_lineage"),
  state: text("state").notNull(),
  county: text("county").notNull(),
  status: text("status").notNull().default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
  status: true,
  approvedAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  lineage: z.string().min(1, "Please select a lineage"),
  state: z.string().min(2, "State is required"),
  county: z.string().min(2, "County is required"),
  otherLineage: z.string().optional(),
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Grouped submissions type for admin dashboard
export type GroupedSubmissions = {
  lineage: string;
  submissions: Submission[];
  count: number;
};
