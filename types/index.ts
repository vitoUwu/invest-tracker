import type { ObjectId } from "mongoose";

export interface InvestmentRegistry {
  _id: ObjectId;
  investmentId: ObjectId;
  amount: number;
  type: "contribution" | "income";
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  _id: ObjectId;
  name: string;
}

export interface InvestmentWithRegistry extends Investment {
  registries: InvestmentRegistry[];
}
