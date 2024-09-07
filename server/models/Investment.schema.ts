import { defineMongooseModel } from "#nuxt/mongoose";
import type { Investment } from "~/types";

export const InvestmentSchema = defineMongooseModel<Investment>({
  name: "Investment",
  schema: {
    name: {
      type: "string",
      required: true,
    },
  },
  options: {
    timestamps: true,
  },
});
