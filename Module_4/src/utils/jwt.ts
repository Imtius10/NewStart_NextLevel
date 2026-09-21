import jwt from "jsonwebtoken"
type TokenType = "access" | "refresh"
export const createToken = (payload:object,type:TokenType) => { 


    const secret = type === "access" ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;

  const expiresIn =
    type === "access"
      ? "15m"
      : "7d";

  if (!secret) {
    throw new Error(
      `${type === "access" ? "JWT_ACCESS_SECRET" : "JWT_REFRESH_SECRET"} is not defined`
    );
  }

  return jwt.sign(payload, secret, {
    expiresIn,
  });
}