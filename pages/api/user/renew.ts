import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import { signToken } from "../../../utils";
import { isValidToken } from "../../../utils/jwt";

type Data =
  | {
      message: string;
    }
  | {
      user: {
        email: string;
        name: string;
        role: string;
      };
      token: string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return renew(req, res);
    default:
      return res.status(400).json({
        message: "bad request",
      });
  }
}

async function renew(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { token = "" } = req.cookies;

  let userId = "";
  try {
    userId = await isValidToken(token);
  } catch (error) {
    return res.status(401).json({
      message: "token no valido",
    });
  }

  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();

  if (!user) {
    return res.status(404).json({
      message: "usuario no encontrado",
    });
  }

  const { email, name, role } = user;

  const newToken = signToken(userId, email);

  return res.status(200).json({
    user: {
      email,
      name,
      role,
    },
    token: newToken,
  });
}
