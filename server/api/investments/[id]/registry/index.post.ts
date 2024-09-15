import { mongo } from "mongoose";
import { z } from "zod";
import { InvestmentRegistrySchema } from "~/server/models/InvestmentRegistry.schema";

const newRegistrySchema = z.object({
  amount: z.number(),
  type: z.enum(["contribution", "income"]),
  boughtAt: z.string(),
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

  const data = newRegistrySchema.safeParse(await readBody(event));

  if (!data.success) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    await useStorage("cache").clear();

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
