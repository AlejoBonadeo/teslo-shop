import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Product as IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const {gender = 'all'} = req.query;
  
  const condition = gender === 'all' ? {} : {gender}

  await db.connect();

  const products = await Product.find(condition)
    .select("title images price inStock slug -_id")
    .lean();

  await db.disconnect();

  if(!products.length) {
      return res.status(404).json({
          message: 'Category does not exist'
      })
  }

  res.status(200).json(products);
};
