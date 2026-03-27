import {useContext} from "react";
import Menubar from "./components/Menubar/Menubar.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import ManageCategories from "./pages/ManageCategories/ManageCategories.jsx";
import {Navigate, Routes, Route, useLocation} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Login from "./pages/Login/Login.jsx";
import Success from "./pages/Success/Success.jsx";
import OrderHistory from "./pages/OrderHistory/OrderHistory.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import ActivityLog from "./pages/ActivityLog/ActivityLog.jsx";
import {AppContext} from "./context/AppContext.jsx";
import {isAdminRole} from "./utils/roleUtils.js";

const AdminRoute = ({ isAdmin, children }) => {
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};


const App = () => {
    const location = useLocation();
    const { auth } = useContext(AppContext);
    const isAdmin = isAdminRole(auth?.role, localStorage.getItem("role"));
    const hiddenMenubarRoutes = new Set(["/login", "/success"]);
    const shouldHideMenubar = hiddenMenubarRoutes.has(location.pathname.toLowerCase());

    return (
        <div>
            {!shouldHideMenubar && <Menubar/>}
            <Toaster/>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                    path="/category"
                    element={<AdminRoute isAdmin={isAdmin}><ManageCategories /></AdminRoute>}
                />
                <Route
                    path="/users"
                    element={<AdminRoute isAdmin={isAdmin}><ManageUsers /></AdminRoute>}
                />
                <Route
                    path="/items"
                    element={<AdminRoute isAdmin={isAdmin}><ManageItems /></AdminRoute>}
                />
                <Route path="/explore" element={<Explore />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                    path="/activity-log"
                    element={<AdminRoute isAdmin={isAdmin}><ActivityLog /></AdminRoute>}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/success" element={<Success />} />
            </Routes>

        </div>
    );
}
export default App;