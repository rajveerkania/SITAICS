import mongoose, { Schema } from "mongoose";
const subjectSchema = new Schema({
  
  subjectName:{

    required:[true,"CourseName field is required"],
    type:Schema.Types.String 


  },
  subjectCode:{
    required:[true,"SubjectCode field is required"],
    unique:true,
    type:Schema.Types.String
  },
  subjectCredits:{
    required:[true,"SubjectCredits  field is required"],
    type:Schema.Types.String
  },

  
},
{ timestamps: true }
);
export const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);