import axios from "axios";


const apiHarmSongPublic = axios.create({
    baseURL: "https://sandbox.academiadevelopers.com/harmonyhub/",
    //baseURL: "http://127.0.0.1:8000/",
});




export default apiHarmSongPublic;