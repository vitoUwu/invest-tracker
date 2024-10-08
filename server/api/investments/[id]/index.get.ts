import { mongo } from "mongoose";
import { InvestmentSchema } from "~/server/models/Investment.schema";

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
    const investiment = await InvestmentSchema.findById(id);

    if (!investiment) {
      return { statusCode: 404 };
    }

    const registries = await InvestmentRegistrySchema.find({
      investmentId: investiment._id,
    }).populate("investmentId");

    return {
      _id: investiment._id,
      name: investiment.name,
      registries,
    };
  } catch (error) {
    console.error({ event, error });
    return new Response("An error has occured while fetching investiment", {
      status: 500,
    });
  }
});
