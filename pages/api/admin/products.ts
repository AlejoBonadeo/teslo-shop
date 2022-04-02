import type { NextApiRequest, NextApiResponse } from "next";
import { Product as IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { db } from "../../../database";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return addProduct(req, res);

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect();
  const products = await Product.find().sort({ title: "asc" }).lean();
  await db.disconnect();
  
  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`; 
    })
    return product;
  })

  return res.status(200).json(updatedProducts);
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }
  if (images.length < 2) {
    return res.status(400).json({ message: "At least 2 images are required" });
  }

  try {
    await db.connect();

    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Promise.all(
      product.images
        .filter((img) => !images.includes(img))
        .map((img) =>
          cloudinary.uploader.destroy(
            img.substring(img.lastIndexOf("/") + 1).split(".")[0]
          )
        )
    );

    await product.update(req.body);
    await db.disconnect();
    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: "Server error" });
  }
}

async function addProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: "At least 2 images are required" });
  }
  try {
    await db.connect();

    const foundProduct = await Product.findOne({ slug: req.body.slug });

    if (foundProduct) {
      await db.disconnect();
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = await Product.create(req.body);

    await db.disconnect();

    return res.status(201).json(product);
  } catch (error) {}
}
