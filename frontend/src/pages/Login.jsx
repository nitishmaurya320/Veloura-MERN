import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import login from "../assets/login.png"
import { loginUser } from '../../redux/slices/authSlice'
import { mergeCart } from '../../redux/slices/cartSlice'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, guestId, loading } = useSelector(state => state.auth)
  const { cart } = useSelector(state => state.cart)

  const redirect = new URLSearchParams(location.search).get("redirect") || "/"
  const isCheckoutRedirect = redirect.includes("checkout")

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/")
        })
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/")
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      return toast.error("Please enter Email and Password", 2000)
    }
    dispatch(loginUser({ email, password }))
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg flex flex-col gap-6">
          
          {/* Logo */}
          <div className="text-4xl font-extrabold text-[#c8a261] text-center mb-4">Veloura</div>
          <p className="text-center text-gray-500">Login to your account</p>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a261] transition"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a261] transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-[#c8a261] hover:bg-[#b38f4f] text-white font-semibold rounded-lg transition"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link onClick={()=>window.scrollTo({top:0})} to={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-[#c8a261] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-1/2 relative">
        <img src={login} alt="Login" className="w-full h-full object-cover rounded-l-xl" />
        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-l-xl"></div>
      </div>
    </div>
  )
}

export default Login
