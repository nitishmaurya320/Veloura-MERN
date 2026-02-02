import React, { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import {Toaster} from "sonner"
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import Checkout from './components/Cart/Checkout'
import Orderconfirmation from './pages/Orderconfirmation'
import OrderDetails from './pages/OrderDetails'
import MyOrders from './pages/MyOrders'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomePage from './components/Admin/AdminHomePage'
import UserManagement from './components/Admin/UserManagement'
import ProductManagement from './components/Admin/ProductManagement'
import EditProduct from './components/Admin/EditProduct'
import OrderManagement from './components/Admin/OrderManagement'

import {Provider} from "react-redux"
import store from '../redux/store'
import ProtectedRoute from './components/Common/ProtectedRoute'
import Product from './components/Products/Product'
import WishList from './pages/WishList'

  


const App = () => {
    
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Toaster position="top-right"></Toaster>
    <Routes className="body" >
      <Route path="/" element={<UserLayout/>} >
      <Route index element={<Home/>} />
     <Route path="login" element={<Login/>}/>
     <Route path="signup" element={<Signup/>}/>
     <Route path="profile" element={<Profile/>}/>
     <Route path="collections/:collection" element={<CollectionPage />}/>
     <Route path="checkout" element={<Checkout/>}/>
     <Route path="order-confirmation/:orderId" element={<Orderconfirmation/>} />
     <Route path="orders/:id" element={<OrderDetails/>} />
     <Route path="my-orders" element={<MyOrders margin={100} />} />
     <Route path="/product/:id" element={<Product />}></Route>
     <Route path="/mywishlist" element={<WishList/>}></Route>
      </Route>
      
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout/></ProtectedRoute>}>
        <Route index element={<AdminHomePage/>}/>
        <Route path="users" element={<UserManagement/>}/> 
        <Route path="products" element={<ProductManagement/>}></Route>
        <Route path="products/:id/edit" element={<EditProduct/>}></Route>
        <Route path="orders" element={<OrderManagement/>}></Route>
      </Route>

      
    
    </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App
