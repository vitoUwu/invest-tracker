import { mongo } from "mongoose";
import { InvestmentRegistrySchema } from "~/server/models/InvestmentRegistry.schema";
import registrySchema from "~/utils/forms/registry.schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    return new Response("Missing investiment id", { status: 400 });
  }

  const isObjectId = mongo.BSON.ObjectId.isValid(id);
  if (!isObjectId) {
    return new Response("Invalid investiment id", { status: 400 });
  }

  const data = registrySchema.safeParse(await readBody(event));

  if (!data.success) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    const cache = useStorage("cache");
    await cache.removeItem(`nitro:handlers:getInvestment:${id}.json`);
    await cache.removeItem("nitro:handlers:getInvestments:default.json");
    return await InvestmentRegistrySchema.create({
      investmentId: id,
      amount: data.data.amount * 100,
      type: data.data.type,
      createdAt: new Date(data.data.boughtAt),
    });
  } catch (error) {
    console.error({ error, event });
    return new Response("An error has occured while creating investment", {
      status: 500,
    });
  }
});
