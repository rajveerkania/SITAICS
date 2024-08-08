import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decoded;
  } catch (error) {
    return null;
  }
};
