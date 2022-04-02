import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";

type Data =
  | {
      numberOfOrders: number;
      paidOrders: number;
      unpaidOrders: number;
      numberOfUsers: number;
      numberOfProducts: number;
      productsWithNoStock: number;
      productsWithLowStock: number;
    }
  | { message: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getAll(req, res);
    default:
      return res.status(400).json({
        message: `Method ${req.method} not allowed`,
      });
  }
}
async function getAll(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect();

  const [users, orders, products] = await Promise.all([
    User.count(),
    Order.find().lean(),
    Product.find().lean(),
  ])

  await db.disconnect();

  return res.status(200).json({
    numberOfOrders: orders.length,
    paidOrders: orders.filter((order) => order.isPaid).length,
    unpaidOrders: orders.filter((order) => !order.isPaid).length,
    numberOfUsers: users,
    numberOfProducts: products.length,
    productsWithNoStock: products.filter((product) => !product.inStock).length,
    productsWithLowStock: products.filter((product) => product.inStock < 5)
      .length,
  });

}
