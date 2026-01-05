import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
// We'll store user queries for analytics/persistence
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  condition: text("condition").notNull(),
  city: text("city").notNull(),
  hospitalType: text("hospital_type").notNull(),
  roomType: text("room_type").notNull(),
  age: integer("age").notNull(),
  // Insurance details
  coverageAmount: integer("coverage_amount"),
  copayPercent: integer("copay_percent"),
  monthlyIncome: integer("monthly_income"),
  // Results
  estimatedCost: integer("estimated_cost"),
  recommendation: text("recommendation"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertInquirySchema = createInsertSchema(inquiries).omit({ 
  id: true, 
  createdAt: true,
  estimatedCost: true,
  recommendation: true 
});

// === API CONTRACT TYPES ===

// 1. Predict Cost
export const predictCostSchema = z.object({
  condition: z.string(),
  city: z.string(),
  hospital_type: z.string(), // Keeping snake_case to match user spec for API, or mapping it. Let's use camelCase for TS standard and map in route.
  room_type: z.string(),
  age: z.coerce.number().min(0).max(120)
});

export const predictCostResponseSchema = z.object({
  min_cost: z.number(),
  avg_cost: z.number(),
  max_cost: z.number()
});

// 2. Check Insurance
export const checkInsuranceSchema = z.object({
  coverage_amount: z.coerce.number(),
  copay_percent: z.coerce.number().min(0).max(100)
});

export const checkInsuranceResponseSchema = z.object({
  explanation: z.string(),
  out_of_pocket_estimate: z.number()
});

// 3. Recommend Finance
export const recommendFinanceSchema = z.object({
  predicted_avg_cost: z.coerce.number(),
  insurance_coverage: z.coerce.number(),
  monthly_income: z.coerce.number()
});

export const recommendFinanceResponseSchema = z.object({
  recommendation: z.string(),
  action_plan: z.array(z.string()) // Added action plan for better UI
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
