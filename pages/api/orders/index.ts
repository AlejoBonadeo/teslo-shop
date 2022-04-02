import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { Order as IOrder } from "../../../interfaces";
import { Product } from "../../../models";
import {Order} from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const productIds = orderItems.map((item) => item._id);

  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();

  try {
    const subTotal = orderItems.reduce((acc, i) => {
      const product = dbProducts.find((p) => {
        return p._id.toString() === i._id;
      });
      if (!product) {
        throw new Error("Product not found");
      }
      return acc + i.quantity * product.price;
    }, 0);

    const taxRate = 0.15;

    const backendTotal = subTotal * (taxRate + 1);

    if (total !== backendTotal) {
      return res.status(403).json({ message: "Total is not correct" });
    }
    ``;
    const userId = session.user._id;
    const newOrder = await Order.create({
      ...req.body,
      isPaid: false,
      user: userId,
      total: Math.round(total * 100) / 100,
    });
    await db.disconnect();
    return res.status(201).json(newOrder);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: "Bad request" });
  }
};
