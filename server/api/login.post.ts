import jwt from "jsonwebtoken";
import loginSchema from "~/utils/forms/login.schema";
import { UserSchema } from "../models/User.schema";

export default defineEventHandler(async (event) => {
  const data = loginSchema.safeParse(await readBody(event));

  if (!data.success) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    const doc = await UserSchema.findOne({ email: data.data.email });

    if (!doc) {
      return new Response("Invalid email or password", { status: 401 });
    }

    const password = data.data.password;
    const arrBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(password)
    );
    const hexHash = Buffer.from(arrBuffer).toString("hex");
    if (doc.password !== hexHash) {
      return new Response("Invalid email or password", { status: 401 });
    }

    setCookie(
      event,
      "auth",
      jwt.sign({ id: doc._id.toString() }, process.env.JWT_SECRET as string),
      {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      }
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error({ error, event });
    return new Response("An error has occured while creating investment", {
      status: 500,
    });
  }
});
