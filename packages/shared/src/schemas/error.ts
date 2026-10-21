import { z } from 'zod';

export const ErrorDetailSchema = z.object({
  field: z.string().optional(),
  issue: z.string(),
});

export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;

export const StandardErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(ErrorDetailSchema).optional(),
    requestId: z.string().uuid().optional(),
  }),
});

export type StandardErrorResponse = z.infer<typeof StandardErrorResponseSchema>;
