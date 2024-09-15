import { z } from "zod";

export default z.object({
  amount: z.number().default(0),
  calculateDifference: z.boolean().default(false),
  isIncome: z.boolean().default(false),
  boughtAt: z.string(),
});
