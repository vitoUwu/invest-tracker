import type { Types } from "mongoose";

export interface InvestmentRegistry {
  _id: Types.ObjectId;
  investmentId: Types.ObjectId;
  amount: number;
  type: "contribution" | "income";
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  _id: Types.ObjectId;
  name: string;
}

export interface InvestmentWithRegistry extends Investment {
  registries: InvestmentRegistry[];
}
