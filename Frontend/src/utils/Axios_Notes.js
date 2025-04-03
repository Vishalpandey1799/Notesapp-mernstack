import axios from "axios";

export const axiosNotesInstance = axios.create({
    baseURL : import.meta.env.VITE_NOTES_URL||"http://localhost:5000/api/user",

    headers : {
        "Content-Type" : "application/json"
    },

    withCredentials : true
});