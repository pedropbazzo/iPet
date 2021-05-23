import axios from 'axios';
import hostUrl from "./constants"

const api = axios.create({
    baseURL:`${hostUrl}`
})

export default api;