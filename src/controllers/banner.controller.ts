import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import Banner from "../models/banner.model";

const bannerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bannerList = await Banner.find({});
    res.send({
      status: "success",
      data: bannerList,
    });
  } catch (error: any) {
    if (error.isJoi === true)
      return next(new createError.BadRequest("banner not found"));
    next(error);
  }
};

const updateBanner = async (req: Request, res: Response) => {
  const newBanner = new Banner(req.body);
  try {
    await newBanner.save();
    res.send(newBanner);
  } catch (error) {
    res.sendStatus(500);
  }
};
export default { bannerController, updateBanner };
