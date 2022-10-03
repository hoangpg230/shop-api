import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String, require: true },
  title: { type: String, require: true },
  description: { type: String, require: true },
  image: { type: String, require: true },
});

const Banner = mongoose.model("Banner", userSchema);

export default Banner;
