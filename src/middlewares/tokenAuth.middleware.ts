import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const tokenAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.split(" ")[1]) {
    return response.status(401).json({ message: "JWT is missing" });
  }
  try {
    const [, token] = authHeader.split(" ");

    const secret = process.env.JWT_SECRET_KEY || "default";

    const decoded = verify(token, secret);

    const { sub } = decoded;

    request.user = {
      id: sub as string,
    };

    return next();
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export default tokenAuth;
