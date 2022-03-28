import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("NO hay semilla de JWT - Revisar variables de entorno");
  }

  return jwt.sign(
    {
      _id,
      email,
    },
    process.env.JWT_SECRET_SEED,
    { expiresIn: "30d" }
  );
};

export const isValidToken = async (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("NO hay semilla de JWT - Revisar variables de entorno");
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_SEED!, (err, payload) => {
      if (err) {
        reject("JWT no valido");
      }
      const { _id } = payload as { _id: string };
      resolve(_id);
    });
  });
};
