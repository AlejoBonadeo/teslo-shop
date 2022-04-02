import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User as IUser } from "../../../interfaces";
import { User } from "../../../models";
import mongoose from "mongoose";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "PATCH":
      return updateUser(req, res);
    default:
      res.status(405).json({ message: "Method Not Allowed" });
  }
}
async function getUsers(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect();
  const users = await User.find().select("-password").lean();
  await db.disconnect();

  return res.status(200).json(users);
}

async function updateUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id = "", role = "" } = req.body;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  await db.connect();
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findOneAndUpdate({ _id: id }, { role });

    await db.disconnect();
    return res.status(200).json({ message: "User updated" });
}
