import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Microsoft Notebook Logic: Risk Score & Insurance Mapping
  const riskCoefficients = {
    sex_male: -0.185917,
    smoker_yes: 236.511289,
    region_northwest: -3.706773,
    region_southeast: -6.578643,
    region_southwest: -8.097994,
    age: 2.569757,
    bmi: 3.370926,
    children: 4.252788
  };

  const scoreToCharge = {
    coefficient: 100.5865091,
    intercept: -12123.200203717966
  };

  // MIC Dataset Logic: Base Indian Healthcare Costs
  const INDIAN_BASE_COSTS: Record<string, number> = {
    "cardiac_surgery": 850000,
    "typhoid": 45000,
    "cataract_surgery": 65000,
    "dialysis": 25000,
    "knee_replacement": 350000
  };

  const CITY_MULTIPLIER: Record<string, number> = {
    "Chennai": 1.2,
    "Delhi": 1.5,
    "Pune": 1.1,
    "Hyderabad": 1.3,
    "Jaipur": 1.0
  };

  app.post(api.prediction.predict.path, async (req, res) => {
    try {
      const input = api.prediction.predict.input.parse(req.body);
      
      // 1. Calculate Base Healthcare Cost (MIC Dataset Logic)
      let baseCost = INDIAN_BASE_COSTS[input.condition.toLowerCase().replace(" ", "_")] || 100000;
      const cityMult = CITY_MULTIPLIER[input.city] || 1.0;
      
      // 2. Calculate Insurance Risk/Charge (Microsoft Notebook Logic)
      let riskScore = 0;
      riskScore += input.age * riskCoefficients.age;
      if (input.bmi) riskScore += input.bmi * riskCoefficients.bmi;
      if (input.children) riskScore += input.children * riskCoefficients.children;
      if (input.sex === "male") riskScore += riskCoefficients.sex_male;
      if (input.smoker === "yes") riskScore += riskCoefficients.smoker_yes;
      if (input.region === "northwest") riskScore += riskCoefficients.region_northwest;
      if (input.region === "southeast") riskScore += riskCoefficients.region_southeast;
      if (input.region === "southwest") riskScore += riskCoefficients.region_southwest;

      const predictedInsuranceCharge = Math.max(0, riskScore * scoreToCharge.coefficient + scoreToCharge.intercept);

      // 3. Combined Logic for Indian Context
      const avgCost = Math.round((baseCost * cityMult + predictedInsuranceCharge) / 2);
      const minCost = Math.round(avgCost * 0.8);
      const maxCost = Math.round(avgCost * 1.3);

      res.json({
        min_cost: minCost,
        avg_cost: avgCost,
        max_cost: maxCost,
        risk_score: Math.round(riskScore)
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
      
      let explanation = `Your insurance covers up to ₹${input.coverage_amount.toLocaleString()}. `;
      if (input.copay_percent > 0) {
        explanation += `You have a ${input.copay_percent}% copay, which is common in Indian policies. You will pay ${input.copay_percent}% of the total bill.`;
      } else {
        explanation += `You have no copay, providing full coverage for allowable expenses.`;
      }

      res.json({
        explanation,
        out_of_pocket_estimate: 0
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
          "Confirm network hospital status in your city.",
          "Keep TPA contact details ready.",
          "Ask for cashless pre-authorization."
        ];
      } else if (coverageGap < monthly_income * 1.5) {
        recommendation = "There is a manageable gap based on your monthly income profile.";
        actionPlan = [
          "Check for employer-provided top-up insurance.",
          "Negotiate room rates (General Ward vs Private).",
          "Inquire about interest-free EMI options."
        ];
      } else {
        recommendation = "High financial stress detected. The cost exceeds 1.5 months of income.";
        actionPlan = [
          "Mandatory: Check 'Cashless' status immediately.",
          "Apply for medical finance/loans early.",
          "Consider opting for a government-empanelled hospital.",
          "Review generic medication options to reduce pharmacy bills."
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
