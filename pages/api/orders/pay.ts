import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order } from "../../../models";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getPaypalBearerToken = async () => {
  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      new URLSearchParams("grant_type=client_credentials"),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`, 'utf-8'
          ).toString('base64')}`,
        },
      }
    );
    return data.access_token;
  } catch (error) {
    return null;
  }
};

async function payOrder(req: NextApiRequest, res: NextApiResponse<Data>) {

  const paypalBearerToken = await getPaypalBearerToken();
  console.log(paypalBearerToken)

  if(!paypalBearerToken) {
    return res.status(500).json({ message: "Could not get token" });
  }

  const { transactionId = "", orderId = "" } = req.body;

  const {data} = await axios.get(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${paypalBearerToken}`,
    },
  })

  if(data.status !== "COMPLETED") {
    return res.status(401).json({ message: "Order not completed" });
  }

  await db.connect();

  const order = await Order.findById(orderId);

  if(!order) {
    await db.disconnect();
    return res.status(404).json({ message: "Order not found" });
  }

  if(order.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res.status(403).json({ message: "Order total is not correct" });
  }

  await Order.findByIdAndUpdate(orderId, {
    transactionId,
    isPaid: true,
  })

  await db.disconnect();

  res.status(200).json({ message: "Order paid" });
}
