import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../../redux/slices/authSlice";

const GoogleLoginBtn = () => {
  const dispatch = useDispatch();

  const handleSuccess = async (res) => {
    
    console.log(res.credential)
    dispatch(googleLogin(res.credential));
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
};

export default GoogleLoginBtn;
