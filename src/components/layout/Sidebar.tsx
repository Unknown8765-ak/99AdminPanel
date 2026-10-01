import {
  FaTachometerAlt,
  FaBox,
  FaTags,
  FaShoppingCart,
  FaUsers,
  // FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import {logoutUserAPI} from "../../services/auth.service"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../auth/authSlice";


import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: <FaBox />,
  },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: <FaTags />,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <FaShoppingCart />,
  },
  {
    title: "Customers",
    path: "/admin/customers",
    icon: <FaUsers />,
  },
  // {
  //   title: "Settings",
  //   path: "/admin/settings",
  //   icon: <FaCog />,
  // },
  {
    title: "Profile",
    path: "/admin/profile",
    icon: <FaUserCircle />,
  },
];

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) return;

  try {
    await logoutUserAPI();

    dispatch(logout());
    navigate("/admin/login", {
      // replace: true,
    });

  } catch (error) {
    console.log(error);
    // toast.error(error.message);
  }
};
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold">99 Admin</h2>

        <p className="text-gray-400 text-sm mt-1">
          E-commerce Management
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-5">
        <button
         onClick={handleLogout}
          type="button"
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;