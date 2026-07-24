import axios from 'axios';

const API_URL = 'http://localhost:5000/api/message';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network-level failure (server unreachable, CORS block, timeout) — no
            // response to inspect, so synthesize one so downstream `throw
            // error.response.data` calls don't crash on `undefined.data`.
            error.response = { data: { message: "Network error. Please check your connection and try again." } };
        }
        return Promise.reject(error);
    }
);

export const sendMessageService = async(data)=>{
    try {
        const response = await axiosInstance.post("/send",data);
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const getMessagesService = async(id,token)=>{
    try {
        const response = await axiosInstance.get(`/${id}/${token}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}