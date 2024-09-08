import { defineMongooseModel } from "#nuxt/mongoose";
import type { User } from "~/types";

export const UserSchema = defineMongooseModel<User>({
  name: "User",
  schema: {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  options: {
    timestamps: true,
  },
});
