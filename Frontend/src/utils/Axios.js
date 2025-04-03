import axios from "axios"
 
 console.log(import.meta.env.VITE_USER_URL)

export const axiosInstance = axios.create({
    baseURL :  import.meta.env.VITE_USER_URL||"http://localhost:5000/api",
    headers : {
        "Content-Type" : "application/json",
  
    },

    withCredentials : true,

    
})