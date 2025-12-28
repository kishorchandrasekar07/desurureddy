import { 
  type User, 
  type InsertSubmission, 
  type Submission, 
  type GroupedSubmissions,
  submissions 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getAllSubmissions(): Promise<Submission[]>;
  getSubmissionsGroupedByLineage(): Promise<GroupedSubmissions[]>;
}

export class DatabaseStorage implements IStorage {
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db
      .insert(submissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt));
  }

  async getSubmissionsGroupedByLineage(): Promise<GroupedSubmissions[]> {
    const allSubmissions = await this.getAllSubmissions();
    
    const grouped = allSubmissions.reduce((acc, submission) => {
      const lineage = submission.lineage;
      if (!acc[lineage]) {
        acc[lineage] = [];
      }
      acc[lineage].push(submission);
      return acc;
    }, {} as Record<string, Submission[]>);

    return Object.entries(grouped).map(([lineage, items]) => ({
      lineage,
      submissions: items,
      count: items.length,
    }));
  }
}

export const storage = new DatabaseStorage();
