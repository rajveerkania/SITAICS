import mongoose, { Schema } from "mongoose";
const courseSchema = new Schema({
    courseName: {
        required: [true, "CourseName field is required"],
        type: Schema.Types.String,
        unique: true
    },
    courseDuration: {
        required: [true, "courseDuration field is required"],
        type: Schema.Types.String
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: true,
      }

},
    { timestamps: true }
);
export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema); 
