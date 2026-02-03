import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//helper function to load cart items from localStorage
const loadCartFromStorage = () => { 
    const storedCart = localStorage.getItem("cartItems");
    try {
        const parsed = JSON.parse(storedCart);
        return parsed && typeof parsed === 'object' ? parsed : { products: [] };
    } catch (error) {
        return { products: [] };
    }
}


//helper function to save cart items to localStorage

const saveCartToStorage = (cart) => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
}

//fetch cart for a user or guest
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId,guestId},{rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            params: { userId, guestId }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    } 

})

//add product to cart
export const addToCart = createAsyncThunk("cart/addToCart", async ({productId, quantity,size,color,brand, userId, guestId}, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            size,
            color,
            brand,
            userId,
            guestId
        });
        console.log("1")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//update product quantity in cart
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({productId, quantity, size,brand,color, userId, guestId}, {rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            size,
            brand,
            color,
            userId,
            guestId
        });
        
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

//remove product from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({productId,size,brand,color, userId, guestId}, {rejectWithValue}) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            data: { productId,size,brand,color,userId, guestId }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

//merge guest cart with user cart
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId,user}, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, {
            
            guestId,user
        },{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }   
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] };
            localStorage.removeItem("cart");
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = false;
                saveCartToStorage(state.cart);
            })  
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message|| "Failed to fetch cart";
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
               state.cart = action.payload;
                state.loading = false;
                saveCartToStorage(action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add item to cart";
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = false;
                saveCartToStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message|| "Failed to update item quantity";
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = false;
                saveCartToStorage(action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to remove item from cart";
            }) 
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = false;
                saveCartToStorage(action.payload);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to merge cart";
            });
            
        }
    })

    export const { clearCart } = cartSlice.actions;
    export default cartSlice.reducer;