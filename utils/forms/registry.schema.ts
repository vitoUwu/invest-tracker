import { z } from "zod";

export default z.object({
  amount: z.number().default(0),
  type: z.enum(["contribution", "income"]),
  boughtAt: z.string(),
});
