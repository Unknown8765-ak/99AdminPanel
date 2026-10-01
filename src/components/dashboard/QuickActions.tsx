import { Link } from "react-router-dom";

import {
  FaBox,
  FaTags,
  FaShoppingCart,
  FaUsers,
  // FaCog,
  FaUserCircle,
} from "react-icons/fa";

const actions = [
  {
    title: "Manage Products",
    path: "/admin/products",
    icon: <FaBox />,
    color: "bg-blue-500",
    description: "Add, edit and manage products.",
  },
  {
    title: "Manage Categories",
    path: "/admin/categories",
    icon: <FaTags />,
    color: "bg-purple-500",
    description: "Create and manage product categories.",
  },
  {
    title: "Manage Orders",
    path: "/admin/orders",
    icon: <FaShoppingCart />,
    color: "bg-green-500",
    description: "View and manage customer orders.",
  },
  {
    title: "Customers",
    path: "/admin/customers",
    icon: <FaUsers />,
    color: "bg-orange-500",
    description: "View and manage customers.",
  },
  // {
  //   title: "Settings",
  //   path: "/admin/settings",
  //   icon: <FaCog />,
  //   color: "bg-slate-500",
  //   description: "Manage application settings.",
  // },
  {
    title: "My Profile",
    path: "/admin/profile",
    icon: <FaUserCircle />,
    color: "bg-indigo-500",
    description: "View and manage your admin profile.",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl ${action.color}`}
            >
              {action.icon}
            </div>

            {/* Title */}
            <h3 className="mt-5 text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 mt-2 text-sm">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;