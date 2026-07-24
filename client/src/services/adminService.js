import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials:true,
});

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("admin_access_token");
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
                    localStorage.setItem("admin_access_token",accessToken);
                    axiosInstance.defaults.headers.common['Authorization']=`Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (error) {
                    window.location.href='/admin/login';
                }
            
        }
        return Promise.reject(error);
    }
 );


export const login = async(data)=>{
    try {
        const response = await axiosInstance.post('/login',data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const logout = async()=>{
    try {
        const response = await axiosInstance.post('/logout',{},{withCredentials:true});
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

export const fetchUsers = async()=>{
    try {
        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const changeUserStatus = async(data)=>{
    try{
        const response = await axiosInstance.patch('/changeUserStatus',data);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}

export const addCategoryService = async(data)=>{
    try{
        const response = await axiosInstance.post("/category",data,{headers:{"Content-Type":"multipart/form-data"}});
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}


export const getCategoriesService = async()=>{
    try {
        const response = await axiosInstance.get("/categories");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const deleteCategoryService = async(id)=>{
    try {
        const response = await axiosInstance.delete(`/category/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getApplications = async()=>{
    try {
        const response = await axiosInstance.get("/applications");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const acceptApplication = async(id)=>{
    try {
        const response = await axiosInstance.post("/application",{id});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const rejectApplication = async(id)=>{
    try {
        const response = await axiosInstance.delete(`/application/${id}`);
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const fetchEmployee=async()=>{
    try {
        const response = await axiosInstance.get("/employees");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const changeEmployeeStatus = async(id,status)=>{
    try {
        const response = await axiosInstance.patch(`/employee-status/${id}`,{status});
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const addService=async(data)=>{
    try {
        let response = await axiosInstance.post("/service",data,{headers: {'Content-Type': 'multipart/form-data'}});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const getAllServices = async()=>{
    try {
        let response = await axiosInstance.get("/services");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const deleteService = async(id)=>{
    try {
        let response = await axiosInstance.delete(`/service/${id}`);
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const getService = async(id)=>{
    try {
        let response = await axiosInstance.get(`/service/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const updateService = async(id,data)=>{
    try {
        let response = await axiosInstance.patch(`/service/${id}`,data,{headers: {'Content-Type': 'multipart/form-data'}});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}

export const getOrdersService = async()=>{
    try {
        let response = await axiosInstance.get("/orders");
        return response.data; 
    } catch (error) {
        throw error.response.data;
    }
}

export const getOrderDetails = async(id)=>{
    try {
        let response = await axiosInstance.get(`/order/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const salesDataService = async()=>{
    try {
        let response = await axiosInstance.get("/sales-data");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getDashboardDataService = async()=>{
    try {
        let response = await axiosInstance.get("/dashboard");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getCategoryDetails = async(id)=>{
    try {
        let response = await axiosInstance.get(`/category/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const updateCategory = async(id,data)=>{
    try {
        let response = await axiosInstance.patch(`/category/${id}`,data,{headers:{'Content-Type':'multipart/form-data'}});
        return response;
    } catch (error) {
        throw error.response.data;
    }
}