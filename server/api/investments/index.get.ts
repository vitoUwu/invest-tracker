import { InvestmentSchema } from "~/server/models/Investment.schema";

export default defineEventHandler(async (event) => {
  try {
    return await InvestmentSchema.find({});
  } catch (error) {
    return error;
  }
});
