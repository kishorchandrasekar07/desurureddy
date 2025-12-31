import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Gothram to House Names mapping - alphabetically sorted by Gothram
export const GOTHRAM_HOUSE_DATA: Record<string, string[]> = {
  "Alathuru": ["Kotamaru Varu", "Masi Reddy Varu"],
  "Balamani": ["Pullam Reddy Varu"],
  "Bhujana pala": ["Polam Reddy Varu"],
  "Chimatapala": ["Gunda Reddy Varu", "Sathukumata Varu"],
  "Chinthamani": ["Vema Reddy Varu"],
  "Ekkachakkara": ["Kaval Reddy Varu", "Velavaya Reddy Varu"],
  "Enabala": ["Kesa Reddy Varu"],
  "Ennumuru": ["Binna Reddy Varu"],
  "Eswaraka": ["Eepuru Varu", "Eswaraka Varu", "Padala Varu", "Nellipudi Varu", "Maramreddy Varu", "Sripathy Reddy Varu", "Rama Reddy Varu", "Papa Reddy Varu", "Deva Reddy Varu", "Parvatha Reddy Varu", "Pocha Reddy Varu", "Pethaa Reddy Varu"],
  "Ethurupala": ["Krishna Reddy Varu", "Kattam Reddy Varu", "Patharthi Varu"],
  "Govindapala": ["Sanna Reddy Varu", "Dhuvvuru Varu"],
  "Gurukundhapala": ["Veguru Varu"],
  "Kajakandapala": ["Penumalleevari"],
  "Kalakanthra": ["Bappa Reddy Varu"],
  "Kalathama": ["Kalakanthra mu Varu"],
  "Kalavakonda": ["Koduru Varu", "Dhuvvuru Varu", "Veguru Varu", "Mulukuru Varu", "Kappuvuru Varu"],
  "Kalemepalu": ["Mole Reddy Varu"],
  "Kanapala": ["Ballam Reddy Varu"],
  "Kesangala": ["Gundala Varu"],
  "Kolleepala": ["Bairam Reddy Varu", "Bandya Reddy Varu"],
  "Kotapala": ["Pelletti Varu"],
  "Kuchipala": ["Chenna Reddy Varu"],
  "Kuvvam": ["Nagati Varu"],
  "Madamanuru": ["Nalla Reddy Varu", "Cheepa Reddy Varu", "Guduru Varu"],
  "Madhanabala": ["Kaaku Varu", "Rapooru Varu"],
  "Madhananthara": ["Vakati Varu", "Petta Varu", "Gengapuru Varu", "Gendavaram Varu"],
  "Paalasali": ["Pappuveluru Varu"],
  "Palakathali": ["Petta Varu"],
  "Palasari": ["Kadivetti Varu", "Nelavaya Varu"],
  "Palasesha": ["Jalathangi Varu"],
  "Palavalli": ["Sowjelli Varu"],
  "Pallamalla": ["Sarva Reddy Varu", "Pelluru Varu"],
  "Pallamaala": ["Alluri Varu", "Mallupattu Varu", "Bemma Reddy Varu", "Rami Reddy Varu", "Linga Reddy Varu", "Chintham Reddy Varu", "Basivi Reddy Varu"],
  "Paluru": ["Pallam Reddy Varu", "Varadha Reddy Varu"],
  "paripala": ["Oduru Varu"],
  "Polipala": ["Dhuvvuru Varu"],
  "Raajanapala": ["Linga Reddy Varu", "Tanguturu Varu", "Nagalapuram Varu", "Gundala Varu"],
  "Reypala": ["Naga Reddy Varu", "Thupelee Reddy Varu"],
  "Seshapala": ["Uppuveluru Varu"],
  "Sripala": ["Malla Varu Varu"],
  "Thanyali": ["Chilakuru Varu", "Dhupelee Varu"],
  "Thirumuru": ["Kotta Varu", "Guduru Varu"],
  "Vallaraju": ["Agasthiya Reddy Varu"],
  "Vasanthapala": ["Kami Reddy Varu"],
  "Yallasiri": ["Kami Reddy Varu"],
  "Yanamanabala": ["Kesi Reddy Varu"],
};

// Get sorted list of Gothrams for dropdown
export const GOTHRAM_OPTIONS = Object.keys(GOTHRAM_HOUSE_DATA).sort((a, b) => 
  a.toLowerCase().localeCompare(b.toLowerCase())
);

// Gender options
export const GENDER_OPTIONS = ["Male", "Female"] as const;

// User submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  community: text("community").notNull().default("Desuru Reddy"),
  gender: text("gender"),
  dateOfBirth: date("date_of_birth"),
  presentAddress: text("present_address"),
  nativePlace: text("native_place"),
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
  gender: z.enum(["Male", "Female"], { required_error: "Please select gender" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  presentAddress: z.string().min(5, "Present address is required"),
  nativePlace: z.string().min(2, "Native place is required"),
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
