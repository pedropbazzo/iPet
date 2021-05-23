import axios from 'axios';

const api = axios.create({
    baseURL: 'http://ipet-backend.herokuapp.com'
})

export default api;