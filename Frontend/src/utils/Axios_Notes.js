import axios from "axios";

export const axiosNotesInstance = axios.create({
    baseURL : "http://localhost:5000/api/user",

    headers : {
        "Content-Type" : "application/json"
    },

    withCredentials : true
});