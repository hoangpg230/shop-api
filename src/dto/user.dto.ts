import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  isValidPassword(password: string): Promise<boolean>;
}
