
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({})
 
const Database_Connection = async() =>{

    try {
       await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected ! ")
    } catch (error) {
        console.log("Error in connecting database ! " , error)
    }
 
}
 

export default Database_Connection;