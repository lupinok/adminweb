import React from "react";
import Access from "views/admin/access";

// Admin Imports
import MainDashboard from "views/admin/default";
import AdminAccount from "views/admin/marketplace";
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
import QuestionPage from "views/admin/question/questions";

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
  permission?: {
    module: string;
    resource?: string;
  };
}

const routes: RouteItem[] = [
  {
    name: "HomePage",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Manage admins",
    layout: "/admin",
    path: "account",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <AdminAccount />,
    permission: {
      module: "SYSTEM_MANAGEMENT"
    }
  },
  {
    name: "Manage users",
    layout: "/admin",
    path: "user",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <DataTables />,
  },
  {
    name: "Manage courses",
    layout: "/admin",
    path: "courses",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    permission: {
      module: "CONTENT_MANAGEMENT"
    }
  },
  {
    name: "Permission",
    layout: "/admin",
    path: "permission",
    icon: <MdLock className="h-6 w-6" />,
    component: <PermissionPage />,
    permission: {
      module: "SYSTEM_MANAGEMENT"
    }
  },
  {
    name: "Role",
    layout: "/admin",
    path: "role",
    icon: <MdLock className="h-6 w-6" />,
    component: <RolePage />,
    permission: {
      module: "SYSTEM_MANAGEMENT"
    }
  },
  {
    name: "Sign in",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Question",
    layout: "/admin",
    path: "question",
    icon: <MdHome className="h-6 w-6" />,
    component: <QuestionPage />,
    permission: {
      module: "CONTENT_MANAGEMENT"
    }
  },
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
