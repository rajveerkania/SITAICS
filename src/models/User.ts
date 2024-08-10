import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      required: [true, "Username field is required."],
      minlength: [5, "Username must be 5 character long."],
      type: Schema.Types.String,
      unique: true,
    },
    name: {
      required: [true, "Name field is required."],
      minLength: [2, "Name must be 2 character long."],
      type: Schema.Types.String,
    },
    email: {
      required: [true, "Email field is required."],
      type: Schema.Types.String,
      unique: true,
      trim: true,
    },
    password: {
      required: true,
      type: Schema.Types.String,
    },
    role: {
      required: true,
      type: Schema.Types.String,
      default: "User",
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    password_reset_token: {
      required: false,
      type: Schema.Types.String,
      trim: true,
    },
  },
  { timestamps: true }
);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
