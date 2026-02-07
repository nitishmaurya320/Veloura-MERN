import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

//retrieve user info and token from localStorage if available

const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//check for an existing guest Id in the local storage or generate a new one

const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

//initial state
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
  registerSuccess: false,
};

//Async Thunk for user login

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData,
        {
          withCredentials: true,
        },
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));

      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleToken, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
        { token: googleToken }, // 👈 GOOGLE TOKEN
        { withCredentials: true }, // 👈 REQUIRED
      );

      // same behavior as local login
      console.log(response);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));

      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

//Async Thunk for user Registration

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData,
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);
export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
        userData,
        { withCredentials: true },
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/logout`,
        {},
        { withCredentials: true },
      );
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  },
);

//Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      state.registerSuccess = false;
      // await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`,{withCredentials:true})

      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.guestId = `guest_${Date.now()}`;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.user=action.payload
        state.error = null;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.user = null;
        state.registerSuccess = false;
      })
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Google login failed";
      });
  },
});

export const { logout, generateNewGuestId, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
