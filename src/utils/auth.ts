import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedUser {
  userId: any;
  id: string;
  username: string;
  email: string;
  role: string;
}

export const verifyToken = (token?: string): DecodedUser | null => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_SECRET!
      ) as DecodedUser;
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
};
