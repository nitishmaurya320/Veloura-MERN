import { Outlet } from "react-router-dom";
import Header from "../Common/Header";

const AuthLayout = () => {
  return (
    <div className="authlayout min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
