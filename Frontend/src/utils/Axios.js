import axios from "axios"
 

//  console.log(import.meta.env.VITE_SERVER_URL)

export const axiosInstance = axios.create({
    baseURL : "http://localhost:5000/api",
    headers : {
        "Content-Type" : "application/json",
  
    },

    withCredentials : true,

    
})