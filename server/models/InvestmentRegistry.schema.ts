import { defineMongooseModel } from "#nuxt/mongoose";
import { Types } from "mongoose";
import type { InvestmentRegistry } from "~/types";

export const InvestmentRegistrySchema = defineMongooseModel<InvestmentRegistry>(
  {
    name: "InvestmentRegistry",
    schema: {
      investmentId: {
        type: Types.ObjectId,
        required: true,
      },
      amount: {
        type: "number",
        required: true,
      },
      type: {
        type: "string",
        enum: ["contribution", "income"],
        required: true,
      },
    },
    options: {
      timestamps: true,
    },
  }
);
