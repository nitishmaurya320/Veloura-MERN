import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


//fetch all users
export const fetchUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async () => {
        
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
                withCredentials:true
            });
         return response.data;
        
    }
);

//add the create user section
export const addUser = createAsyncThunk(
    "admin/addUser",async (userData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData, {
                withCredentials:true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    })

//update user info
export const updateUser = createAsyncThunk(
    "admin/updateUser",async ({id,role}) => {
        
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {role}, 
                {
                withCredentials:true
            }
            );
             return response.data;
        
    })

    //delete user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
    
         await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
            withCredentials:true
        });
        return id;
   
}
)

const adminSlice = createSlice({
    name:"admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading=false
                state.users=action.payload
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch users";
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            const updatedUser = action.payload;
            const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
            if (userIndex !== -1) {
                state.users[userIndex] = updatedUser;
            }
            
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
                const id=action.payload
            state.users = state.users.filter(user => user._id !==id);
        })
        .addCase(addUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload.user);
        })
        .addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to add user";
        });

    }

})

export default adminSlice.reducer;