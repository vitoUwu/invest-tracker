import { InvestmentRegistrySchema } from "~/server/models/InvestmentRegistry.schema";

export default defineEventHandler(async (event) => {
  try {
    return await InvestmentRegistrySchema.find({
      investmentId: event.context.params?.id,
    });
  } catch (error) {
    console.error({ error, event });
    return new Response("An error has occured while fetching investment", {
      status: 500,
    });
  }
});
