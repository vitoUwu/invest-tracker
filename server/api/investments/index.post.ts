import { InvestmentSchema } from "~/server/models/Investment.schema";
import investmentSchema from "~/utils/forms/investment.schema";

export default defineEventHandler(async (event) => {
  const data = investmentSchema.safeParse(await readBody(event));

  if (!data.success) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    const doc = await InvestmentSchema.create({
      name: data.data.name,
      createdAt: new Date(),
    });

    const registry = await InvestmentRegistrySchema.create({
      investmentId: doc._id,
      amount: data.data.initialAmount * 100,
      type: "contribution",
      createdAt: new Date(),
    });

    await useStorage("cache").clear();

    return { _id: doc._id, name: doc.name, registries: [registry] };
  } catch (error) {
    console.error({ error, event });
    return new Response("An error has occured while creating investment", {
      status: 500,
    });
  }
});
