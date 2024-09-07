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
    const investiment = await InvestmentSchema.findById(id);

    if (!investiment) {
      return { statusCode: 404 };
    }

    const registries = await InvestmentRegistrySchema.find({
      investmentId: investiment._id,
    }).populate("investmentId");

    return {
      investiment,
      registries,
      all: await InvestmentRegistrySchema.find(),
    };
  } catch (error) {
    console.error({ event, error });
    return new Response("An error has occured while fetching investiment", {
      status: 500,
    });
  }
});
