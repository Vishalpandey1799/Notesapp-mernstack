import axios from "axios";

export const axiosNotesInstance = axios.create({
    baseURL :"https://notes-writelt.onrender.com/api/user",

    headers : {
        "Content-Type" : "application/json"
    },

    withCredentials : true
});