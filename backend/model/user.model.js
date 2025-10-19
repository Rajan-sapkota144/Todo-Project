import mongoose  from "mongoose";
import { type } from "os";
import { text } from "stream/consumers";
import { string } from "zod";
const userschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    token:{
        type:String
    }
});
const user=mongoose.model("User",userschema);
export default user;