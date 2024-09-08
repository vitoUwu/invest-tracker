import { mongo } from "mongoose";
import { z } from "zod";
import { InvestmentRegistrySchema } from "~/server/models/InvestmentRegistry.schema";

const schema = z.object({
  ids: z.array(z.string()).min(1),
});

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    return new Response("Missing investiment id", { status: 400 });
  }

  const isObjectId = mongo.BSON.ObjectId.isValid(id);
  if (!isObjectId) {
    return new Response("Invalid investiment id", { status: 400 });
  }

  const body = schema.safeParse(await readBody(event));

  if (!body.success) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    const cache = useStorage("cache");
    await cache.removeItem(`nitro:handlers:getInvestment:${id}.json`);
    await cache.removeItem("nitro:handlers:getInvestments:default.json");
    return await InvestmentRegistrySchema.deleteMany({
      _id: { $in: body.data.ids },
      investmentId: id,
    });
  } catch (error) {
    console.error({ error, event });
    return new Response("An error has occured while deleting investment", {
      status: 500,
    });
  }
});
