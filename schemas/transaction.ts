import { z } from "zod";

export const transactionSchema = z.object({
	transactionId: z.string(),
	amount: z.number().int().positive(),
	status: z.string(), // TODO: Add enum
});

export type Transaction = z.infer<typeof transactionSchema>;
