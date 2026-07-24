import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfileService, loginService, logoutService, updateEmployeeProfileService } from "../services/employeeService";


const initialState = {
    isLoggedIn: false,
    employee: JSON.parse(localStorage.getItem("employee"))||null,
    error: null,
    token:localStorage.getItem("employee_access_token")|| null,
}

export const login = createAsyncThunk("employee/login",async(data,thunkApi)=>{
    try {
        return await loginService(data);
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
});

export const logout = createAsyncThunk("employee/logout", async (_,thunkApi)=>{
    try {
        return await logoutService();
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
});

export const getProfile = createAsyncThunk("employee/getProfile",async(_,thunkApi)=>{
    try{
        return await getProfileService();
    }catch(error){
        return thunkApi.rejectWithValue(error);
    }
})

export const updateEmployeeProfile = createAsyncThunk("employee/updateEmployeeProfile",async(data,thunkApi)=>{
    try {
        return await updateEmployeeProfileService(data);
    } catch (error) {
        return thunkApi.rejectWithValue(error);
    }
})

export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
    },
    extraReducers:(builder)=>{
        builder.addCase(login.fulfilled,(state,action)=>{
            state.isLoggedIn = true;
            state.employee = action.payload.employee;
            state.token = action.payload.token;
            localStorage.setItem("employee", JSON.stringify(action.payload.employee));
            localStorage.setItem("employee_access_token", action.payload.token);
        })
        .addCase(login.rejected,(state,action)=>{
            state.error = action.payload;
            state.isLoggedIn = false;
            localStorage.removeItem("employee_access_token");
            localStorage.removeItem("employee");
        })
        .addCase(logout.fulfilled,(state)=>{
            state.isLoggedIn = false;
            state.employee = null;
            state.token = null;
            localStorage.removeItem("employee_access_token");
            localStorage.removeItem("employee");
        })
        .addCase(logout.rejected,(state,action)=>{
            state.error = action.payload;
            state.isLoggedIn = false;
        })
        .addCase(getProfile.fulfilled,(state,action)=>{
            state.employee = action.payload;
        })
        .addCase(updateEmployeeProfile.fulfilled,(state,action)=>{
            state.employee = action.payload;
        })
    }
});

export default employeeSlice.reducer;