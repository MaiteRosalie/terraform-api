import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "name is required"),
  price:  z
    .number({ error: "price must be a number" })
    .transform((value) => Number(value.toFixed(2))),
});

export type ItemInput = z.infer<typeof itemSchema>;
