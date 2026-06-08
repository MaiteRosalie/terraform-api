import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "name is required")
});

export type ItemInput = z.infer<typeof itemSchema>;
