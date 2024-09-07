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
    await InvestmentSchema.deleteOne({ _id: id });
    await InvestmentRegistrySchema.deleteMany({ investmentId: id });
    return new Response(null, { status: 204 });
  } catch (error) {
    return error;
  }
});
