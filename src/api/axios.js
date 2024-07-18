import axios from "axios"
const BASE_URL = 'https://car-expense-tracker-h6k1.onrender.com/'

export default axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {"Content-Type" : "application/json"},
    withCredentials: true
})