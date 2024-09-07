import type { ObjectId } from "mongoose";

export const asString = (id: ObjectId): string => id as unknown as string;
