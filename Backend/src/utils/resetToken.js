import jwt from "jsonwebtoken";

import dotenv from "dotenv"

dotenv.config({})

export const token_for_reset = (userid) =>{
   return jwt.sign({userid} , process.env.JWT_SECRET , {
    expiresIn : "10m"
   });
}