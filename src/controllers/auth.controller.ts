import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

import { IUser } from "../dto/user.dto";
import User from "../models/user.model";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import authValidation from "../validations/auth.validation";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authValidation.login.validateAsync(req.body);

    const user = (await User.findOne({ email: result.email })) as IUser;
    if (!user) throw new createError.NotFound("User not register");

    const isMath = await user.isValidPassword(result.password);
    if (!isMath)
      throw new createError.Unauthorized("Email/Password is not valid");

    const accessToken = await signAccessToken(user.id);
    const infoUser = user.toObject();
    delete infoUser.password;
    const refreshToken = await signRefreshToken(user.id);
    res.send({
      accessToken,
      user: infoUser,
      refreshToken,
    });
  } catch (error: any) {
    if (error.isJoi === true)
      return next(new createError.BadRequest("Invalid Email/Password"));
    next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authValidation.register.validateAsync(req.body);
    const doesExit = await User.findOne({ email: result.email });
    if (doesExit) {
      console.log(doesExit);
      throw new createError.Conflict(
        `${result.email} is already been registered`
      );
    }
    const user = new User(result);
    const savedUser = await user.save();

    const accessToken = await signAccessToken(savedUser.id);
    res.send({
      accessToken,
    });
  } catch (error: any) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

export default {
  login,
  register,
};
