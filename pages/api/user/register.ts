import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { isEmail, signToken } from "../../../utils";

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
    case "POST":
      return register(req, res);
    default:
      return res.status(400).json({
        message: "bad request",
      });
  }
}

async function register(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = "", password = "", name = "" } = req.body;

  await db.connect();

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: "El usuario ya existe",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }
  if (name.length < 3) {
    return res.status(400).json({
      message: "El nombre debe tener al menos 3 caracteres",
    });
  }
  if(!isEmail(email)){
    return res.status(400).json({
      message: "El email no es válido",
    });
  }
  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    name,
    role: "client",
  });
  try {
      await newUser.save({validateBeforeSave: true});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al crear el usuario",
    });
  }

  await db.disconnect();

  const { _id, role } = newUser;

  const token = signToken(_id, email);

  res.status(200).json({
    token: token,
    user: { email, role, name },
  });
}
