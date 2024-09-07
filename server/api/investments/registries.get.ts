export default defineEventHandler(async (event) => {
  try {
    return await InvestmentRegistrySchema.find({});
  } catch (error) {
    return error;
  }
});
