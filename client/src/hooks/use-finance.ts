import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Helper type to get inferred Zod types
type InferInput<T extends z.ZodType> = z.infer<T>;
type InferResponse<T extends z.ZodType> = z.infer<T>;

export function usePredictCost() {
  return useMutation({
    mutationFn: async (data: InferInput<typeof api.prediction.predict.input>) => {
      const res = await fetch(api.prediction.predict.path, {
        method: api.prediction.predict.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to predict cost");
      }

      return api.prediction.predict.responses[200].parse(await res.json());
    },
  });
}

export function useCheckInsurance() {
  return useMutation({
    mutationFn: async (data: InferInput<typeof api.prediction.insurance.input>) => {
      const res = await fetch(api.prediction.insurance.path, {
        method: api.prediction.insurance.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to check insurance");
      }

      return api.prediction.insurance.responses[200].parse(await res.json());
    },
  });
}

export function useRecommendFinance() {
  return useMutation({
    mutationFn: async (data: InferInput<typeof api.prediction.recommend.input>) => {
      const res = await fetch(api.prediction.recommend.path, {
        method: api.prediction.recommend.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to get recommendation");
      }

      return api.prediction.recommend.responses[200].parse(await res.json());
    },
  });
}
