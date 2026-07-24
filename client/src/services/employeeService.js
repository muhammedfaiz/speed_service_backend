import axios from 'axios';

const API_URL = 'https://speed-service.onrender.com/api/employee';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("employee_access_token");
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest = error.config;
        if(!error.response){
            // Network-level failure (server unreachable, CORS block, timeout) — no
            // response to inspect, so synthesize one so downstream `throw
            // error.response.data` calls don't crash on `undefined.data`.
            error.response = { data: { message: "Network error. Please check your connection and try again." } };
            return Promise.reject(error);
        }
        if(error.response.status === 401 &&!originalRequest._retry){
            originalRequest._retry = true;
                try {
                    const response = await axiosInstance.post('/refreshToken',{},{withCredentials:true});
                    const {accessToken}=response.data;
                    localStorage.setItem("employee_access_token",accessToken);
                    axiosInstance.defaults.headers.common['Authorization']=`Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (error) {
                    window.location.href='/employee/login';
                }
            
        }
        return Promise.reject(error);
    }
 );


export const loginService = async(data)=>{
    try {
        const response = await axiosInstance.post('/login', data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const logoutService = async()=>{
    try {
        const response = await axiosInstance.post('/logout', {}, {withCredentials: true});
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const fetchServices = async()=>{
    try {
        const response = await axiosInstance.get('/services/'+localStorage.getItem("employee_access_token"));
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const acceptService = async(id)=>{
    try {
        const response = await axiosInstance.patch('/accept-service',{token:localStorage.getItem('employee_access_token'),id});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const rejectService = async(id)=>{
    try {

        const response = await axiosInstance.patch('/reject-service',{token:localStorage.getItem('employee_access_token'),id});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const getRequests = async()=>{
    try{
        const response = await axiosInstance.get('/requests/'+localStorage.getItem("employee_access_token"));
        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

export const acceptRequest = async(id)=>{
    try {
        const response = await axiosInstance.patch('/accept-request',{token:localStorage.getItem('employee_access_token'),id});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const getTasks = async()=>{
    try {
        const response = await axiosInstance.get("/tasks");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const taskComplete = async(id)=>{
    try {
        const response = await axiosInstance.patch("/task-complete",{id});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const getCompletedTasks = async()=>{
    try {
        const response = await axiosInstance.get("/history");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const fetchEmployeeStats = async()=>{
    try {
        const response = await axiosInstance.get("/getStats");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const fetchRecentActivities = async()=>{
    try {
        const response = await axiosInstance.get("/recentActivities");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getProfileService = async()=>{
    try {
        const response = await axiosInstance.get("/profile");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const updateEmployeeProfileService = async(data)=>{
    try {
        const response = await axiosInstance.patch("/profile",data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}