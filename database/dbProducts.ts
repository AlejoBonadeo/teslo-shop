import { db } from ".";
import { Product as IProduct } from "../interfaces";
import { Product } from "../models";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await db.connect();

  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if (!product) {
    return null;
  }

  product.images = product.images.map(image => {
    return image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`; 
  })


  return JSON.parse(JSON.stringify(product));
};

export const getAllProductsSlug = async (): Promise<string[]> => {
  await db.connect();

  const slugs = await Product.find().select("slug -_id").lean();

  await db.disconnect();

  return slugs.map((s) => s.slug);
};

export const getProductByCategory = async (
  category?: string
): Promise<IProduct[] | null> => {
  await db.connect();

  const products = await Product.find({ gender: category })
    .select("title images price inStock slug -_id")
    .lean();

  await db.disconnect();

  if (!products?.length) {
    return null;
  }
  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`; 
    })
    return product;
  })

  return updatedProducts;
};

export const getProductsByTerm = async(term: string) => {

  const q = term.toString().toLowerCase();

  await db.connect();

  const products = await Product.find({
    $text: { $search: q },
  })
    .select("title images price inStock slug -_id")
    .lean();

  await db.disconnect();

  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`; 
    })
    return product;
  })

  return updatedProducts;
}
