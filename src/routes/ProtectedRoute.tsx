import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

type RootState = {
  auth: {
    status: boolean;
    loading: boolean;
  };
};

const ProtectedRoute = () => {
  const { status, loading } = useSelector(
    (state: RootState) => state.auth
  );

  console.log(
    "proAUTH STATE1 👉",
    status,
    // "proLOADING1 👉",
    // loading
  );

  // Checking authentication
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-blue-600"></div>

        <p className="mt-4 text-gray-600 font-medium">
          Checking authentication...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!status) {
    console.log(
      "proAUTH STATE2 👉",
      status,
      // "proLOADING2 👉",
      // loading
    );

    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated
  return <Outlet />;
};

export default ProtectedRoute;