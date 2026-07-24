import axios from "axios";

const Api_Url = "http://localhost:5000/api/user";

const axiosInstance = axios.create({
  baseURL: Api_Url,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) {
      // Network-level failure (server unreachable, CORS block, timeout, DNS) —
      // there's no server response to inspect, so synthesize one here. Without
      // this, every service function's `throw error.response.data` below would
      // crash on `undefined.data` instead of surfacing a real error message.
      error.response = { data: { message: "Network error. Please check your connection and try again." } };
      return Promise.reject(error);
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          Api_Url + "/refreshToken",
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        localStorage.setItem("access_token", accessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log(error);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
const register = async (user) => {
  try {
    const response = await axiosInstance.post("/signup", user);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const login = async (user) => {
  try {
    const response = await axiosInstance.post("/login", user);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const verifyOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/verifyOtp", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const resendOtp = async (user) => {
  try {
    const response = await axiosInstance.post("/resendOtp", user);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const logout = async () => {
  try {
    const response = await axiosInstance.post("/logout", {});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const fetchServices = async () => {
  try {
    const response = await axiosInstance.get("/services");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getServiceDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/service/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const addAddressPost = async (address) => {
  try {
    const response = await axiosInstance.post("/address", {
      address,
      token: localStorage.getItem("access_token"),
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

const getAddresses = async()=>{
  try {
    const response = await axiosInstance.get(`/addresses/${localStorage.getItem("access_token")}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

const addToCart = async (id)=>{
  try {
    const response = await axiosInstance.post(`/cart`,{id:id,token:localStorage.getItem("access_token")});
    return response;
  } catch (error) {
    throw error.response.data;
  }
}

const fetchCarts = async()=>{
  try {
    const response = await axiosInstance.get(`/carts`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

const getCartDetails = async(id)=>{
  try {
    const response = await axiosInstance.get(`/cart/${localStorage.getItem("access_token")}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

const updateItemQuantity = async(itemId,categoryId,quantity)=>{
  try {
    const response = await axiosInstance.patch("/cart",{itemId,categoryId,quantity});
    return response;
  } catch (error) {
    throw error.response.data;
  }
}

const placeOrder = async(data)=>{
  try {
    const response = await axiosInstance.post("/order", data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
}

const getClientId = async()=>{
  try {
    const response = await axiosInstance.get("/client-id");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

const getBookings = async()=>{
  try {
    const response = await axiosInstance.get("/bookings");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

const fetchBookingDetails = async(id)=>{
  try {
    const response = await axiosInstance.get(`/booking-details/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const getCheckout = async(id)=>{
  try {
    const response = await axiosInstance.get(`/checkout/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
 }

 export const cancelBooking = async(id)=>{
  try {
    const response = await axiosInstance.patch(`cancel-booking/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
 }

 const submitReview = async(data)=>{
  try {
    const response = await axiosInstance.post("/review", data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
 }

 const getCategories = async()=>{
  try {
    const response = await axiosInstance.get("/categories");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
 }

 const getProfileService = async()=>{
  try {
    const response = await axiosInstance.get("/profile");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
 }

 const changeProfileImageService = async(data)=>{
  try {
    const response = await axiosInstance.patch("/profile-image",data,{headers: {'Content-Type':'multipart/form-data'}});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
 }

 const updateProfileDetailsService = async(data)=>{
  try {
    const response = await axiosInstance.patch("/profile",data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
 }

 const getStatsOfUser = async()=>{
  try {
    const response = await axiosInstance.get("/stats");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
 }

 const forgotPasswordService = async(data)=>{
  try {
    const response = await axiosInstance.post('/forgot-password',data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
 }

 const ResetPassword = async(data)=>{
  try {
    const response = await axiosInstance.post('/reset-password',data);
    return response;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
 }

const userService = {
  register,
  login,
  verifyOtp,
  resendOtp,
  logout,
  fetchServices,
  getServiceDetails,
  addAddressPost,
  getAddresses,
  addToCart,
  fetchCarts,
  getCartDetails,
  updateItemQuantity,
  placeOrder,
  getClientId,
  getBookings,
  fetchBookingDetails,
  getCheckout,
  cancelBooking,
  submitReview,
  getCategories,
  getProfileService,
  changeProfileImageService,
  updateProfileDetailsService,
  getStatsOfUser,
  forgotPasswordService,
  ResetPassword
};
export default userService;
