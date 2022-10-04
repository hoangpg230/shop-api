import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import JWT from "jsonwebtoken";
import router from "../routes";

interface PayloadType {
  userId: string;
}

interface AuthRequest extends Request {
  payload: PayloadType;
}

let refreshTokens: any = [];

const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.ACCESS_TOKEN_SECRET || "SECRET";
    const option = {
      expiresIn: "1h",
    };
    JWT.sign(payload, secret, option, (err, token) => {
      if (err) return reject(createError.InternalServerError);
      resolve(token);
    });
  });
};
const verifyAccessToken = (req: any, res: any, next: any) => {
  if (!req.headers["authorization"])
    return next(new createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "SECRET",
    (err: any, payload: any) => {
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

const signRefreshToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET";

    JWT.sign(payload, secret, (err, token) => {
      if (err) return reject(createError.InternalServerError);
      refreshTokens.push(token);
      resolve(token);
    });
  });
};

const refreshToken = (req: any, res: any, next: any) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);

  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  JWT.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET",
    (err: any, payload: any) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(new createError.Unauthorized());
        }
        return next(new createError.Unauthorized(err.message));
      }
      const accessToken = JWT.sign(
        { userId: payload.userId },
        process.env.ACCESS_TOKEN_SECRET || "SECRET",
        { expiresIn: "1h" }
      );

      res.send({
        accessToken,
      });
    }
  );
};

const logout = (req: Request, res: Response) => {
  const refreshToken = req.body.token;

  refreshTokens = refreshTokens.filter(
    (refToken: any) => refToken != refreshToken
  );
  res.sendStatus(200);
};
export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  refreshToken,
  logout,
};
