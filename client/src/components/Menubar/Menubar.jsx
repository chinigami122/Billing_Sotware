import { useContext, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { isAdminRole } from "../../utils/roleUtils.js";
import './Menubar.css';

const Menubar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuthData } = useContext(AppContext);
    const isAdmin = isAdminRole(auth?.role, localStorage.getItem("role"));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuthData(null, null);
        navigate("/login");
    };

    const getNavLinkClass = ({ isActive }) => {
        const active = (location.pathname === "/dashboard" && isActive) || (location.pathname === "/" && isActive) || isActive;
        return active ? "nav-link-modern active" : "nav-link-modern";
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const userInitial = (auth?.name || localStorage.getItem("name") || "Admin").charAt(0).toUpperCase();

    return (
        <nav className="navbar-modern">
            <div className="navbar-container">
                <Link className="navbar-brand-modern" to="/dashboard">
                    <div className="logo-icon">
                        <i className="bi bi-lightning-charge-fill"></i>
                    </div>
                    <span className="logo-text">Electro<span className="accent">Hub</span></span>
                </Link>

                <div className={`nav-menu-wrapper ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <ul className="nav-list-modern">
                        <li>
                            <NavLink className={getNavLinkClass} to="/dashboard" end onClick={() => setIsMenuOpen(false)}>
                                <i className="bi bi-grid-1x2"></i>
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={getNavLinkClass} to="/explore" end onClick={() => setIsMenuOpen(false)}>
                                <i className="bi bi-shop"></i>
                                <span>POS / Shop</span>
                            </NavLink>
                        </li>
                        {isAdmin && (
                            <>
                                <li>
                                    <NavLink className={getNavLinkClass} to="/items" end onClick={() => setIsMenuOpen(false)}>
                                        <i className="bi bi-box-seam"></i>
                                        <span>Products</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={getNavLinkClass} to="/category" end onClick={() => setIsMenuOpen(false)}>
                                        <i className="bi bi-tags"></i>
                                        <span>Categories</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        <li>
                            <NavLink className={getNavLinkClass} to="/orders" end onClick={() => setIsMenuOpen(false)}>
                                <i className="bi bi-receipt"></i>
                                <span>Orders</span>
                            </NavLink>
                        </li>
                        {isAdmin && (
                            <li>
                                <NavLink className={getNavLinkClass} to="/users" end onClick={() => setIsMenuOpen(false)}>
                                    <i className="bi bi-people"></i>
                                    <span>Team</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="navbar-actions">
                    <div className="avatar-section dropdown">
                        <div className="avatar-trigger" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span className="avatar-label d-none d-sm-block">Hi, {auth?.name?.split(' ')[0] || 'Admin'}</span>
                            <div className="avatar-circle-modern">
                                {userInitial}
                            </div>
                        </div>
                        <ul className="dropdown-menu dropdown-menu-end glass-dropdown" aria-labelledby="profileDropdown">
                            <li className="dropdown-header d-lg-none">
                                <h6 className="mb-0">{auth?.name || 'Admin'}</h6>
                                <small className="text-secondary">{auth?.role || 'Administrator'}</small>
                            </li>
                            <li><Link to="/settings" className="dropdown-item"><i className="bi bi-gear me-2"></i> Settings</Link></li>
                            {isAdmin && <li><Link to="/activity-log" className="dropdown-item"><i className="bi bi-clock-history me-2"></i> Activity Log</Link></li>}
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item text-danger" onClick={logout}><i className="bi bi-box-arrow-right me-2"></i> Logout</button></li>
                        </ul>
                    </div>

                    <button className="mobile-toggle d-lg-none" onClick={toggleMenu}>
                        <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Menubar;
