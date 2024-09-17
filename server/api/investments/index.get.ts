export default defineEventHandler(async (event) => {
  try {
    const investments = await InvestmentSchema.find({});
    const registries = await InvestmentRegistrySchema.find({
      investmentId: { $in: investments.map((i) => i._id) },
    });

    return investments.map(({ _id, name }) => ({
      _id,
      name,
      registries: registries.filter((registry) =>
        registry.investmentId.equals(_id)
      ),
    }));
  } catch (error) {
    console.error({ event, error });
    return new Response("An error has occured while fetching investiments", {
      status: 500,
    });
  }
});
