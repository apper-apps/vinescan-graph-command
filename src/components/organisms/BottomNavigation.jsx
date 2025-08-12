import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const navItems = [
    {
      to: "/scanner",
      icon: "Camera",
      label: "Scanner",
      isCenter: false
    },
    {
      to: "/collection",
      icon: "Wine",
      label: "Collection",
      isCenter: false
    },
    {
      to: "/profile",
      icon: "User",
      label: "Profile",
      isCenter: false
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-wine-beige shadow-lg z-50">
      <div className="flex justify-around items-center px-4 py-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200",
                "min-w-[60px] text-center",
                isActive
                  ? "text-wine-burgundy bg-wine-beige/50 shadow-sm"
                  : "text-gray-500 hover:text-wine-gold hover:bg-wine-beige/30"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-2 rounded-full transition-all duration-200",
                  item.to === "/scanner" && isActive && "bg-gradient-to-r from-wine-gold to-wine-warning text-white shadow-md transform scale-110"
                )}>
                  <ApperIcon 
                    name={item.icon} 
                    size={item.to === "/scanner" ? 28 : 24}
                    className={cn(
                      "transition-all duration-200",
                      item.to === "/scanner" && isActive && "drop-shadow-sm"
                    )}
                  />
                </div>
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;