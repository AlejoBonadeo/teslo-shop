import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Product as IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}
const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;

  await db.connect();

  const product = await Product.findOne({ slug }).lean();

  await db.disconnect();

  if (!product) {
    return res.status(404).json({
        message: "El producto no existe"
    })
  }

  product.images = product.images.map(image => {
    return image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`; 
  })

  res.status(200).json(product)
};
