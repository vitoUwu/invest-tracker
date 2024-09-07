import { InvestmentRegistrySchema } from "~/server/models/InvestmentRegistry.schema";

export default defineEventHandler(async (event) => {
  try {
    return await InvestmentRegistrySchema.find({
      investmentId: event.context.params?.id,
    });
  } catch (error) {
    return error;
  }
});
