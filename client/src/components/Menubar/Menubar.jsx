import { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";
import { isAdminRole } from "../../utils/roleUtils.js";
import './Menubar.css';

const Menubar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuthData } = useContext(AppContext);
    const isAdmin = isAdminRole(auth?.role, localStorage.getItem("role"));

    const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthData(null, null);
    navigate("/login");
    };

    const getNavLinkClass = ({ isActive }) => {
        const dashboardOnRoot = location.pathname === "/";
        if (isActive || dashboardOnRoot) {
            return "nav-link active";
        }
        return "nav-link";
    };

    const getRouteNavClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

    return (
        <>
            {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2">

                    {/* Logo should also use Link (no page reload) */}
                    <Link className="navbar-brand" to="/dashboard">
                        <img
                            src={assets.logo}
                            alt="Logo"
                            height="40"
                        />
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse p-2" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                            <li className="nav-item">
                                <NavLink className={getNavLinkClass} to="/dashboard" end>
                                    Dashboard
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className={getRouteNavClass} to="/explore" end>
                                    Explore
                                </NavLink>
                            </li>

                            {isAdmin && (
                                <li className="nav-item">
                                    <NavLink className={getRouteNavClass} to="/items" end>
                                        Manage Items
                                    </NavLink>
                                </li>
                            )}

                            {isAdmin && (
                                <li className="nav-item">
                                    <NavLink className={getRouteNavClass} to="/category" end>
                                        Manage Categories
                                    </NavLink>
                                </li>
                            )}

                            {isAdmin && (
                                <li className="nav-item">
                                    <NavLink className={getRouteNavClass} to="/users" end>
                                        Manage Users
                                    </NavLink>
                                </li>
                            )}
                            <li className="nav-item">
                                <NavLink className={getRouteNavClass} to="/orders" end>
                                    Orders History
                                </NavLink>
                            </li>

                        </ul>
                        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                            <li className="nav-item dropdown">
                                <button
                                    type="button"
                                    className="nav-link dropdown-toggle btn btn-link p-0 border-0"
                                    id="navbarDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img src={assets.profile} alt="User Avatar" height="32" width="32" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link to="/settings" className="dropdown-item">Settings</Link>
                                    </li>

                                    {isAdmin && (
                                        <li>
                                            <Link to="/activity-log" className="dropdown-item">Activity Log</Link>
                                        </li>
                                    )}

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    <li>
                                        <button type="button" className="dropdown-item" onClick={logout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>    
                    </div>
                </nav>
        </>
    );
};

export default Menubar;
