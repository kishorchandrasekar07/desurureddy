import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

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

  // Get all submissions grouped by category (protected endpoint)
  app.get("/api/submissions/grouped", isAuthenticated, async (req, res) => {
    try {
      const grouped = await storage.getSubmissionsGroupedByCategory();
      return res.json(grouped);
    } catch (error) {
      console.error("Error fetching grouped submissions:", error);
      return res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Get all submissions (protected endpoint)
  app.get("/api/submissions", isAuthenticated, async (req, res) => {
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
