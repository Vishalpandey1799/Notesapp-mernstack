import express from "express"
import dotenv from "dotenv";
import Database_Connection from "./config/database.js";
import userRoute from "./routes/User_Routes.js"
import notesRoutes from "./routes/Notes_Routes.js"
import cookieparser from "cookie-parser"
import cors from "cors"
dotenv.config()

 
 
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(cookieparser())
app.use(express.json())
 
 
app.use("/api",userRoute)
app.use("/api/user", notesRoutes )



 
const startServer = async() =>{
    try {
        await Database_Connection()
            app.listen(PORT,() =>{
                console.log(`server running on ${PORT}`)
            })
    } catch (error) {
        console.log("Error from server")
    }
}

startServer()
