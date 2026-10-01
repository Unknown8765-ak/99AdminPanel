import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthLoader from "./context/AuthLoader";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import ProductDetails from "./components/products/ProductDetails";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import Customers from "./pages/customers/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Profile from "./pages/profile/Profile";



function App() {
  return (
    <BrowserRouter>
     <AuthLoader>

    <ToastContainer
      position="top-right"
      autoClose={3000}
      toastStyle={{
        borderRadius: "10px",
      }}
    />

      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />}/>
        <Route path="/admin/login" element={<Login />} /> 
        <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/:id" element={<ProductDetails />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/categories/add" element={<AddCategory />} />
          <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
          <Route path="/admin/orders" element={<Orders />}/>
          <Route path="/admin/orders/:orderId" element={<OrderDetails />}/>
          <Route path="/admin/customers" element={<Customers />}/>
          <Route path="/admin/customers/:id" element={<CustomerDetails />}/>
          <Route path="/admin/profile" element={<Profile />}/>
          
        </Route>
        </Route>
      </Routes>
      </AuthLoader>
    </BrowserRouter>
  );
}

export default App;