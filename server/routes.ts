import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

const isAdminAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session && (req.session as any).isAdminAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Admin password login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return res.status(500).json({ message: "Admin password not configured" });
    }
    
    if (password === adminPassword) {
      (req.session as any).isAdminAuthenticated = true;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session error" });
        }
        return res.json({ success: true });
      });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).isAdminAuthenticated = false;
    return res.json({ success: true });
  });

  // Check admin auth status
  app.get("/api/admin/status", (req, res) => {
    const isAuthenticated = !!(req.session && (req.session as any).isAdminAuthenticated);
    return res.json({ isAuthenticated });
  });

  // Create a new submission (public endpoint)
  app.post("/api/submissions", async (req, res) => {
    try {
      const parseResult = insertSubmissionSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromError(parseResult.error);
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationError.toString() 
        });
      }

      const submission = await storage.createSubmission(parseResult.data);
      return res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating submission:", error);
      return res.status(500).json({ message: "Failed to create submission" });
    }
  });

  // Get all submissions grouped by lineage (protected endpoint)
  app.get("/api/submissions/grouped", isAdminAuthenticated, async (req, res) => {
    try {
      const grouped = await storage.getSubmissionsGroupedByLineage();
      return res.json(grouped);
    } catch (error) {
      console.error("Error fetching grouped submissions:", error);
      return res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Get all submissions (protected endpoint)
  app.get("/api/submissions", isAdminAuthenticated, async (req, res) => {
    try {
      const allSubmissions = await storage.getAllSubmissions();
      return res.json(allSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  return httpServer;
}
