import { z } from 'zod';
import { 
  predictCostSchema, 
  predictCostResponseSchema, 
  checkInsuranceSchema, 
  checkInsuranceResponseSchema, 
  recommendFinanceSchema, 
  recommendFinanceResponseSchema 
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  prediction: {
    predict: {
      method: 'POST' as const,
      path: '/api/predict-cost',
      input: predictCostSchema,
      responses: {
        200: predictCostResponseSchema,
        400: errorSchemas.validation,
      },
    },
    insurance: {
      method: 'POST' as const,
      path: '/api/check-insurance',
      input: checkInsuranceSchema,
      responses: {
        200: checkInsuranceResponseSchema,
        400: errorSchemas.validation,
      },
    },
    recommend: {
      method: 'POST' as const,
      path: '/api/recommend-finance',
      input: recommendFinanceSchema,
      responses: {
        200: recommendFinanceResponseSchema,
        400: errorSchemas.validation,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
