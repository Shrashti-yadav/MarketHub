import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Profile from "./components/Profile";
import Users from "./components/Users";
import { getUser } from "./store/slices/authSlice";
import { getDashboardStats } from "./store/slices/adminSlice";
import { fetchAllProducts } from "./store/slices/productSlice";
import CreateProductModal from "./modals/CreateProductModal";
import ViewProductModal from "./modals/ViewProductModal";
import UpdateProductModal from "./modals/UpdateProductModal";

function App() {
  const {
    openedComponent,
    isCreateProductModalOpened,
    isViewProductModalOpened,
    isUpdateProductModalOpened,
    selectedProduct,
  } = useSelector((state) => state.extra);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getDashboardStats());
      dispatch(fetchAllProducts());
    }
  }, [isAuthenticated]);

  const renderDashboardContent = () => {
    switch (openedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <Orders />;
      case "Users":
        return <Users />;
      case "Profile":
        return <Profile />;
      case "Products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <div className="flex min-h-screen">
                <SideBar />
                {renderDashboardContent()}
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      <ToastContainer theme="dark" />

      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && (
        <UpdateProductModal selectedProduct={selectedProduct} />
      )}
      {isViewProductModalOpened && (
        <ViewProductModal selectedProduct={selectedProduct} />
      )}
    </Router>
  );
}

export default App;