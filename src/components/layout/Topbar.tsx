import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <header className="bg-white shadow px-8 py-5 flex items-center justify-between">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          99 Admin
        </h1>

        <p className="text-gray-500 text-sm">
          Welcome back, Admin
        </p>
      </div>

      {/* Admin Profile */}
      <div className="flex items-center gap-6">
        <Link
          to="/admin/profile"
          className="flex items-center gap-3 group"
        >
          <FaUserCircle
            size={42}
            className="text-blue-600 group-hover:text-blue-700 transition-colors"
          />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;