import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Dropdown options for the lineage (vaaru) field
export const LINEAGE_OPTIONS = [
  "Ee Ooru Vaaru",
  "Eeshwaraga Vaaru",
  "Padala Vaaru",
  "Nelli Gudi Vaaru",
  "Maram Reddy Vaaru",
  "Uppathi Reddy Vaaru",
  "Rama Reddy Vaaru",
  "Baba Reddy Vaaru",
  "Deva Reddy Vaaru",
  "Parvatha Reddy Vaaru",
  "Posa Reddy Vaaru",
  "Pebbai Reddy",
  "Aluru Vaaru",
  "Malampattu Vaaru",
  "Pemma Reddy Vaaru",
  "Rami Reddy Vaaru",
  "Linga Reddy Vaaru",
  "Chintham Reddy Vaaru",
  "Pasivi Reddy Vaaru",
  "Goduru Vaaru",
  "Duvvuru Vaaru",
  "Venkuru Vaaru",
  "Mulukuri Vaaru",
  "Kapuru Vaaru",
  "Tanguturi Vaaru",
  "Nagalapuram Vaaru",
  "Gundala Vaaru",
  "Vagati Vaaru",
  "Petta Vaaru",
  "Gangapuram Vaaru",
  "Gandavaram Vaaru",
  "Krishna Reddy Vaaru",
  "Katam Reddy Vaaru",
  "Pathrathi Vaaru",
  "Nalla Reddy Vaaru",
  "Seepa Reddy",
  "Guduru Vaaru",
  "Channa Reddy Vaaru",
  "Naga Reddy Vaaru",
  "Dupalli Reddy Vaaru",
  "Chillakuru Vaaru",
  "Gundala Reddy",
  "Sathamadu Vaaru",
  "Kota Maaru",
  "Maasi Reddy",
  "Kakarla Vaaru",
  "Ravuru Vaaru",
  "Sarva Reddy Vaaru",
  "Pelluru Vaaru",
  "Bairam Reddy Vaaru",
  "Pandya Reddy Vaaru",
  "Kavali Reddy Vaaru",
  "Velavaya Vaaru",
  "Pallam Reddy Vaaru",
  "Varada Reddy Vaaru",
  "Katavettu Vaaru",
  "Nelavaya Vaaru",
  "Kotavaru Vaaru",
  "Vema Reddy Vaaru",
  "Babbai Reddy Vaaru",
  "Kala Kandara Vaaru",
  "Pinnala Reddy Vaaru",
  "Kami Reddy Vaaru",
  "Nagayettu Vaaru",
  "Sowjanya Vaaru",
  "Oduru Vaaru",
  "Vetturu Vaaru",
  "Uppula Veluru Vaaru",
  "Babbula Veluru Vaaru",
  "Chenna Reddy Vaaru",
  "Kolam Reddy Vaaru",
  "Moulali Reddy",
  "Kesa Reddy Vaaru",
  "Malla Varapu Vaaru",
  "Kami Reddy",
  "Jettam Kiva Vaaru",
  "Kasi Reddy Vaaru",
  "Penu Malli Vaaru",
  "Pallettu Vaaru",
  "Agastya Reddy Vaaru",
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
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
