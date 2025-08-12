import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "@/components/organisms/BottomNavigation";

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-wine-cream">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;