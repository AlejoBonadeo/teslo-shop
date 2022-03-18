import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../database'
import { Product } from '../../models';
import { initialData } from '../../database/products';

type Data = {
    message: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect();

  await Product.deleteMany()
  const products = await Product.insertMany(initialData.products);

  await db.disconnect()

  res.status(200).json({
      message: products
  })
}