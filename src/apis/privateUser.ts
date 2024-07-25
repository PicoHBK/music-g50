import axios from "axios";


const apiUserPrivate = axios.create({
    baseURL: "https://sandbox.academiadevelopers.com/",
    //baseURL: "http://127.0.0.1:8000/",
});




export default apiUserPrivate;