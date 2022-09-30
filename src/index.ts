import "./config/db";

import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import createError from "http-errors";

import { Error } from "..";
import morgan from "./config/morgan";
import routes from "./routes";

//@ts-ignore
import xss from "xss-clean";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(helmet());

app.use(cors());
app.options("*", cors());

app.use(xss());
app.use(mongoSanitize());

app.use("/", routes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use(async (req, res, next) => {
  next(new createError.NotFound());
});

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
