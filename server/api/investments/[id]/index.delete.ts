import { InvestmentSchema } from "~/server/models/Investment.schema";
import { mongo } from "mongoose";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    return new Response("Missing investiment id", { status: 400 });
  }

  const isObjectId = mongo.BSON.ObjectId.isValid(id);
  if (!isObjectId) {
    return new Response("Invalid investiment id", { status: 400 });
  }

  try {
    const cache = useStorage("cache");
    await cache.removeItem(`nitro:handlers:getInvestment:${id}.json`);
    await cache.removeItem("nitro:handlers:getInvestments:default.json");

    await InvestmentSchema.deleteOne({ _id: id });
    await InvestmentRegistrySchema.deleteMany({ investmentId: id });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error({ error, event });
    return new Response("An error has occured while deleting investment", {
      status: 500,
    });
  }
});
