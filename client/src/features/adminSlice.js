import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout} from '../services/adminService.js';

const initialState = {
    admin:JSON.parse(localStorage.getItem('admin'))||null,
    loading:false,
    error:null,
    token:localStorage.getItem("admin_access_token")||null,
    isSuccess:false,
}

export const adminLogin = createAsyncThunk('admin/login',async(data,thunkApi)=>{
    try {
        return await login(data);
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
});

export const adminLogout = createAsyncThunk('admin/logout',async(_,thunkApi)=>{
    try {
        return await logout();
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
});




const adminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(adminLogin.pending,(state)=>{
            state.loading = true;
        })
        .addCase(adminLogin.fulfilled,(state,action)=>{
            state.loading = false;
            state.admin = action.payload.admin;
            state.token = action.payload.token;
            state.isSuccess = true;
            state.error=null;
            localStorage.setItem('admin_access_token', action.payload.token);
            localStorage.setItem('admin', JSON.stringify(action.payload.admin));
        })
        .addCase(adminLogin.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isSuccess = false;
        })
        .addCase(adminLogout.pending,(state)=>{
            state.loading = true;
        })
        .addCase(adminLogout.fulfilled,(state)=>{
            state.loading = false;
            state.admin = null;
            state.token = null;
            state.isSuccess = true;
            state.error=null;
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin');
        })
        .addCase(adminLogout.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isSuccess = false;
        })
        
    }
})

export default adminSlice.reducer;