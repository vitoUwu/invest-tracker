import { z } from "zod";
import { InvestmentRegistrySchema } from "~/server/models/InvestmentRegistry.schema";

const schema = z.object({
  ids: z.array(z.string()).min(1),
});

export default defineEventHandler(async (event) => {
  const body = schema.safeParse(await readBody(event));

  if (!body.success) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    return await InvestmentRegistrySchema.deleteMany({
      _id: { $in: body.data.ids },
    });
  } catch (error) {
    return error;
  }
});
