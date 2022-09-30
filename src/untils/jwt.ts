import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import JWT from "jsonwebtoken";

interface PayloadType {
  userId: string;
}

interface AuthRequest extends Request {
  payload: PayloadType;
}

const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.ACCESS_TOKEN_SECRET || "SECRET";
    const option = {
      expiresIn: "4h",
    };
    JWT.sign(payload, secret, option, (err, token) => {
      if (err) return reject(createError.InternalServerError);
      resolve(token);
    });
  });
};
const verifyAccessToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers["authorization"])
    return next(new createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "SECRET",
    (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(new createError.Unauthorized());
        }
        return next(new createError.Unauthorized(err.message));
      }
      req.payload = payload as PayloadType;
      next();
    }
  );
};

export { signAccessToken, verifyAccessToken };
