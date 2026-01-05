import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Mock ML Model Logic
  const BASE_COSTS: Record<string, number> = {
    "Cardiac Arrest": 15000,
    "Appendicitis": 5000,
    "Hip Fracture": 12000,
    "Dengue": 2000,
    "Covid-19": 8000
  };

  const CITY_MULTIPLIER: Record<string, number> = {
    "Tier 1": 1.5,
    "Tier 2": 1.2,
    "Tier 3": 1.0
  };

  const HOSPITAL_MULTIPLIER: Record<string, number> = {
    "Corporate": 2.0,
    "Private": 1.5,
    "Government": 0.5
  };

  const ROOM_MULTIPLIER: Record<string, number> = {
    "Private Suite": 1.8,
    "Semi-Private": 1.3,
    "General Ward": 1.0
  };

  app.post(api.prediction.predict.path, async (req, res) => {
    try {
      const input = api.prediction.predict.input.parse(req.body);
      
      // Heuristic Calculation
      let base = BASE_COSTS[input.condition] || 5000;
      
      const cityMult = CITY_MULTIPLIER[input.city] || 1.0;
      const hospMult = HOSPITAL_MULTIPLIER[input.hospital_type] || 1.0;
      const roomMult = ROOM_MULTIPLIER[input.room_type] || 1.0;
      
      // Age factor: older patients might have complications -> higher cost
      const ageFactor = input.age > 60 ? 1.3 : (input.age > 40 ? 1.1 : 1.0);

      const avgCost = Math.round(base * cityMult * hospMult * roomMult * ageFactor);
      const minCost = Math.round(avgCost * 0.85);
      const maxCost = Math.round(avgCost * 1.25);

      res.json({
        min_cost: minCost,
        avg_cost: avgCost,
        max_cost: maxCost
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post(api.prediction.insurance.path, async (req, res) => {
    try {
      const input = api.prediction.insurance.input.parse(req.body);
      
      // Explanation Logic
      let explanation = `Your insurance covers up to $${input.coverage_amount.toLocaleString()}. `;
      if (input.copay_percent > 0) {
        explanation += `You have a ${input.copay_percent}% copay, meaning you pay ${input.copay_percent}% of the allowable bill.`;
      } else {
        explanation += `You have no copay, which is excellent.`;
      }

      // We don't have the cost in this specific endpoint input as per user spec, 
      // but the user's "out_of_pocket_estimate" output implies we should estimate it 
      // based on some hypothetical or maybe the user meant for us to use the previously predicted cost?
      // The endpoint spec in prompt is: Input { coverage, copay }. Output { explanation, out_of_pocket }.
      // Without a total bill amount, "out_of_pocket" is impossible to calculate exactly.
      // I will assume a standard "average claim" for the sake of the endpoint, or return 0 and handle real math in the recommend endpoint.
      // actually, let's just make it descriptive.
      
      res.json({
        explanation,
        out_of_pocket_estimate: 0 // Placeholder, frontend should calculate this using the cost from step 1
      });
    } catch (err) {
      res.status(400).json({ message: "Invalid Input" });
    }
  });

  app.post(api.prediction.recommend.path, async (req, res) => {
    try {
      const input = api.prediction.recommend.input.parse(req.body);
      
      const { predicted_avg_cost, insurance_coverage, monthly_income } = input;
      const coverageGap = Math.max(0, predicted_avg_cost - insurance_coverage);
      
      let recommendation = "";
      let actionPlan: string[] = [];

      if (coverageGap === 0) {
        recommendation = "You are well covered! Your insurance should handle the estimated costs.";
        actionPlan = [
          "Confirm network hospital status.",
          "Keep insurance card ready.",
          "Ask for pre-authorization."
        ];
      } else if (coverageGap < monthly_income * 0.5) {
        recommendation = "There is a small gap, but it looks manageable with your monthly income.";
        actionPlan = [
          "Use savings for the copay/gap.",
          "Ask hospital for a payment plan.",
          "Check if your employer offers medical advance."
        ];
      } else {
        recommendation = "Warning: Significant financial risk detected. The gap exceeds 50% of your monthly income.";
        actionPlan = [
          "Urgent: Contact insurance for 'Cashless' verification.",
          "Explore medical loans or EMI options.",
          "Consider a different room type to lower costs.",
          "Ask for a cost estimate in writing from the hospital."
        ];
      }

      res.json({
        recommendation,
        action_plan: actionPlan
      });
    } catch (err) {
      res.status(400).json({ message: "Invalid Input" });
    }
  });

  return httpServer;
}
