import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";
import PermissionPage from "views/admin/permission/permission";
import RolePage from "views/admin/role/role";

// Định nghĩa các role
export type UserRole = 'SUPER_ADMIN' | 'DOMAIN_ADMIN';

// Interface cho route item
interface RouteItem {
  name: string;
  layout: string;
  path: string;
  icon: JSX.Element;
  component: JSX.Element;
  roles?: UserRole[]; // Thêm roles để kiểm soát quyền truy cập
  secondary?: boolean;
}

const routes: RouteItem[] = [
  {
    name: "Trang chủ",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Quản lý tài khoản",
    layout: "/admin",
    path: "account",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
  },
  {
    name: "Quản lý người dùng",
    layout: "/admin",
    path: "user",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <DataTables />,
  },
  {
    name: "Quản lý khóa học",
    layout: "/admin",
    path: "abc",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign in",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Permission",
    layout: "/admin",
    path: "permission",
    icon: <MdLock className="h-6 w-6" />,
    component: <PermissionPage />,
  },
  {
    name: "Role",
    layout: "/admin",
    path: "role",
    icon: <MdLock className="h-6 w-6" />,
    component: <RolePage />,
  }
  // },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "rtl",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <RTLDefault />,
  //   roles: ['SUPER_ADMIN'], // Chỉ Super Admin mới có quyền truy cập
  // },
];

// Hàm lọc routes dựa trên role của user
export const getAuthorizedRoutes = (userRole: UserRole) => {
  return routes.filter(route => {
    // Nếu route không có roles, cho phép truy cập (ví dụ: trang login)
    if (!route.roles) return true;

    // Kiểm tra xem user có quyền truy cập route này không
    return route.roles.includes(userRole);
  });
};

export default routes;
