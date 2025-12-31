import { 
  type User, 
  type InsertSubmission, 
  type Submission, 
  type GroupedSubmissions,
  submissions 
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getAllSubmissions(): Promise<Submission[]>;
  getApprovedSubmissions(): Promise<Submission[]>;
  getPendingSubmissions(): Promise<Submission[]>;
  approveSubmission(id: number): Promise<Submission | null>;
  getSubmissionsGroupedByGothram(): Promise<GroupedSubmissions[]>;
}

export class DatabaseStorage implements IStorage {
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const status = insertSubmission.gothram === "Other" || insertSubmission.houseName === "Other" ? "pending" : "approved";
    const approvedAt = status === "approved" ? new Date() : null;
    
    const [submission] = await db
      .insert(submissions)
      .values({
        ...insertSubmission,
        status,
        approvedAt,
      })
      .returning();
    return submission;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .orderBy(asc(submissions.gothram), asc(submissions.houseName), asc(submissions.name));
  }

  async getApprovedSubmissions(): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(eq(submissions.status, "approved"))
      .orderBy(asc(submissions.gothram), asc(submissions.houseName), asc(submissions.name));
  }

  async getPendingSubmissions(): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(eq(submissions.status, "pending"))
      .orderBy(asc(submissions.gothram), asc(submissions.houseName), asc(submissions.name));
  }

  async approveSubmission(id: number): Promise<Submission | null> {
    const [submission] = await db
      .update(submissions)
      .set({ 
        status: "approved",
        approvedAt: new Date(),
      })
      .where(eq(submissions.id, id))
      .returning();
    return submission || null;
  }

  async getSubmissionsGroupedByGothram(): Promise<GroupedSubmissions[]> {
    const approvedSubmissions = await this.getApprovedSubmissions();
    
    const grouped = approvedSubmissions.reduce((acc, submission) => {
      const gothram = submission.gothram;
      if (!acc[gothram]) {
        acc[gothram] = [];
      }
      acc[gothram].push(submission);
      return acc;
    }, {} as Record<string, Submission[]>);

    return Object.entries(grouped)
      .map(([gothram, items]) => ({
        gothram,
        submissions: items,
        count: items.length,
      }))
      .sort((a, b) => a.gothram.localeCompare(b.gothram));
  }
}

export const storage = new DatabaseStorage();
