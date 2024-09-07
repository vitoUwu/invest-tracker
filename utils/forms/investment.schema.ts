import { z } from "zod";

export default z.object({
  name: z.string(),
  initialAmount: z.number().default(0),
});
