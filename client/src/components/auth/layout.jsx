import { Outlet } from "react-router-dom";
import ShoppingHeader from "../shopping-view/header";
import Footer from "../common/footer";

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <ShoppingHeader hideRightContent={true} />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default AuthLayout;
