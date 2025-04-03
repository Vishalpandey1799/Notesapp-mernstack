import axios from "axios";

export const axiosNotesInstance = axios.create({
    baseURL : import.meta.env.VITE_NOTES_URL,

    headers : {
        "Content-Type" : "application/json"
    },

    withCredentials : true
});