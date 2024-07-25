import axios from "axios";


const apiHarmSongPrivate = axios.create({
    baseURL: "https://sandbox.academiadevelopers.com/",
    //baseURL: "http://127.0.0.1:8000/",
});




export default apiHarmSongPrivate;