import mongoose, { Schema } from "mongoose";
import { User } from "@/models/User";

const studentSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: User, // Use string reference here
      required: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    enrollmentNumber: {
      type: Schema.Types.Number,
      unique: true,
      default: null, // Default value
    },
    course: {
      type: Schema.Types.String,
      default: "Unknown", // Default value
    },
    address: {
      type: Schema.Types.String,
      default: "Not provided", // Default value
    },
    achievement: {
      type: Schema.Types.String,
      default: "None", // Default value
    },
    bloodGroup: {
      type: Schema.Types.String,
      default: "Unknown", // Default value
    },
    dateOfBirth: {
      type: Schema.Types.Date,
      default: null, // Default value
    },
    contactNumber: {
      type: Schema.Types.Number,
      unique: true,
      default: null, // Default value
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export const StudentDetails = mongoose.models.StudentDetails || mongoose.model("StudentDetails", studentSchema);
