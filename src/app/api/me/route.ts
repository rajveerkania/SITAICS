import { connect } from "@/dbconfig/dbconfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { getDataFromToken } from "@/helpers/getDataFromToken";
import jwt from "jsonwebtoken"

connect()
export async function POST(request:NextRequest){
    try 
    {
            //extract Data from Token
            const userId= await getDataFromToken(request)
           const user = await User.findOne({_id:userId}).select("-password")
            return NextResponse.json({
                message:"user Found",
                data:user 
            })
    } 
    catch (error:any) {
        return NextResponse.json({error},{status:500})
    }
}