import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Gothram to House Names mapping - alphabetically sorted by Gothram
export const GOTHRAM_HOUSE_DATA: Record<string, string[]> = {
  "Alathuru": ["Kotamaru varu", "Masi Reddy varu"],
  "Balamani": ["PullamReddy varu"],
  "Bhujana pala": ["Polam Reddy varu"],
  "Chimatapala": ["Gunda Reddy varu", "Sathukumata varu"],
  "Chinthamani": ["Vema Reddy varu"],
  "Ekkachakkara": ["Kaval Reddy varu", "Velavaya Reddy varu"],
  "Enabala": ["Kesa Reddy varu"],
  "Ennumuru": ["Binna Reddy varu"],
  "Eswaraka": ["Eepuru varu", "Eswaraka varu", "Padala varu", "Nellipudi varu", "Maramreddy varu", "Sripathy Reddy varu", "Rama Reddy varu", "Papa Reddy varu", "Deva Reddy varu", "Parvatha Reddy varu", "Pocha Reddy varu", "Pethaa Reddy varu"],
  "Ethurupala": ["Krishna Reddy varu", "Kattam Reddy varu", "Patharthi varu"],
  "Govindapala": ["Sanna Reddy varu", "Dhuvvuru varu"],
  "Gurukundhapala": ["Veguru varu"],
  "Kajakandapala": ["Penumalleevari"],
  "Kalakanthra": ["Bappa Reddy varu"],
  "Kalathama": ["Kalakanthra mu varu"],
  "Kalavakonda": ["Koduru varu", "Dhuvvuru varu", "Veguru varu", "Mulukuru varu", "Kappuvuru varu"],
  "Kalemepalu": ["Mole Reddy varu"],
  "Kanapala": ["Ballam Reddy varu"],
  "Kesangala": ["Gundala varu"],
  "Kolleepala": ["Bairam Reddy varu", "Bandya Reddy varu"],
  "kotapala": ["Pelletti varu"],
  "Kuchipala": ["Chenna Reddy varu"],
  "Kuvvam": ["Nagati varu"],
  "Madamanuru": ["Nalla Reddy varu", "Cheepa Reddy varu", "Guduru varu"],
  "Madhanabala": ["Kaaku varu", "Rapooru varu"],
  "Madhananthara": ["Vakati varu", "Petta varu", "Gengapuru varu", "Gendavaram varu"],
  "Paalasali": ["Pappuveluru varu"],
  "palakathali": ["Petta varu"],
  "Palasari": ["Kadivetti varu", "Nelavaya varu"],
  "Palasesha": ["Jalathangi varu"],
  "Palavalli": ["Sowjelli varu"],
  "Pallamalla": ["Sarva Reddy varu", "Pelluru varu"],
  "Pallamaala": ["Alluri varu", "Mallupattu varu", "Bemma Reddy varu", "Rami Reddy varu", "Linga Reddy varu", "Chintham Reddy varu", "Basivi Reddy varu"],
  "Paluru": ["Pallam Reddy varu", "Varadha Reddy varu"],
  "paripala": ["Oduru varu"],
  "Polipala": ["Dhuvvuru varu"],
  "Raajanapala": ["Linga Reddy varu", "Tanguturu varu", "Nagalapuram varu", "Gundala varu"],
  "Reypala": ["Naga Reddy varu", "Thupelee Reddy varu"],
  "Seshapala": ["Uppuveluru varu"],
  "Sripala": ["Malla varu varu"],
  "Thanyali": ["Chilakuru varu", "Dhupelee varu"],
  "Thirumuru": ["Kotta varu", "Guduru varu"],
  "Vallaraju": ["Agasthiya Reddy varu"],
  "Vasanthapala": ["Kami Reddy varu"],
  "Yallasiri": ["Kami Reddy varu"],
  "Yanamanabala": ["Kesi Reddy varu"],
};

// Get sorted list of Gothrams for dropdown
export const GOTHRAM_OPTIONS = Object.keys(GOTHRAM_HOUSE_DATA).sort((a, b) => 
  a.toLowerCase().localeCompare(b.toLowerCase())
);

// User submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  community: text("community").notNull().default("Desuru Reddy"),
  gothram: text("gothram").notNull(),
  houseName: text("house_name").notNull(),
  otherGothram: text("other_gothram"),
  otherHouseName: text("other_house_name"),
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
  gothram: z.string().min(1, "Please select a Gothram"),
  houseName: z.string().min(1, "Please select a House Name"),
  state: z.string().min(2, "State is required"),
  county: z.string().min(2, "County is required"),
  otherGothram: z.string().optional(),
  otherHouseName: z.string().optional(),
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Grouped submissions type for admin dashboard
export type GroupedSubmissions = {
  gothram: string;
  submissions: Submission[];
  count: number;
};
