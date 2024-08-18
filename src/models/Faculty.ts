import mongoose,{Schema} from "mongoose";
import {User} from "@/models/User";
import { Subject } from "./Subject";
const facultySchema= new Schema({
    faculty_id:{
        ref:"User",
        type:Schema.Types.Number 

    },
    username: {
        type: Schema.Types.String,
        required: true,
      },
    dateOfBirth:{
        required:[true,"Date of Birth field is required"],
        type:Schema.Types.Number,
        

    },
    email:{
        ref:"User",
        type:Schema.Types.String

    },
    contactNumber:{
        required:[true,"Contact Number field is required"],
        unique:true,
        type:Schema.Types.Number
    },
    achievements:{
        required:[true,"Achievements field is required"],
        type:Schema.Types.String 
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: true,
      },
      isBatchCoordinator:{
        type: Schema.Types.Boolean,
        default: false,
      },
    subject:{
        
    }

},
{timestamps:true}
)