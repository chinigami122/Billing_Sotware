import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext.jsx";
import { fetchProfile, updateProfile } from "../../service/ProfileService.js";
import "./Settings.css";

const Settings = () => {
    const navigate = useNavigate();
    const { setAuthData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        let isMounted = true;
        const loadProfile = async () => {
            try {
                const response = await fetchProfile();
                if (!isMounted) return;
                setProfileData((prev) => ({
                    ...prev,
                    name: response.data?.name || "",
                    email: response.data?.email || ""
                }));
            } catch (error) {
                if (isMounted) toast.error("Failed to load profile details");
            } finally {
                if (isMounted) setProfileLoading(false);
            }
        };
        loadProfile();
        return () => { isMounted = false; };
    }, []);

    const getCurrentUserEmailFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload?.sub || null;
        } catch { return null; }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const payload = {};
        const trimmedName = profileData.name.trim();
        const trimmedEmail = profileData.email.trim();
        const trimmedPassword = profileData.password.trim();

        if (trimmedName) payload.name = trimmedName;
        if (trimmedEmail) payload.email = trimmedEmail;
        if (trimmedPassword) payload.password = trimmedPassword;

        if (Object.keys(payload).length === 0) {
            toast.error("Please provide at least one field to update");
            return;
        }

        setLoading(true);
        try {
            const currentEmail = getCurrentUserEmailFromToken();
            const response = await updateProfile(payload);
            setProfileData((prev) => ({ ...prev, password: "" }));

            const emailWasChanged = payload.email && currentEmail &&
                payload.email.toLowerCase() !== currentEmail.toLowerCase();

            if (emailWasChanged) {
                toast.success("Profile updated. Please sign in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                setAuthData(null, null);
                navigate("/login");
                return;
            }
            toast.success(response.data?.message || "Profile updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page page-container">
            <header className="mb-4">
                <h2 className="page-title m-0">Settings</h2>
                <p className="text-secondary mt-1">Manage your account and shop preferences</p>
            </header>

            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className="glass-card p-4">
                        <h5 className="section-title mb-4">
                            <i className="bi bi-person-circle me-2"></i>
                            Profile Settings
                        </h5>
                        <form onSubmit={onSubmitHandler}>
                            <div className="form-group-modern mb-3">
                                <label className="label-modern">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    className="input-custom"
                                    placeholder="Your name"
                                    style={{width: '100%'}}
                                    value={profileData.name}
                                    onChange={onChangeHandler}
                                />
                            </div>

                            <div className="form-group-modern mb-3">
                                <label className="label-modern">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="input-custom"
                                    placeholder="email@example.com"
                                    style={{width: '100%'}}
                                    value={profileData.email}
                                    onChange={onChangeHandler}
                                />
                            </div>

                            <div className="form-group-modern mb-4">
                                <label className="label-modern">New Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="input-custom"
                                    placeholder="••••••••"
                                    style={{width: '100%'}}
                                    value={profileData.password}
                                    onChange={onChangeHandler}
                                />
                                <small className="text-secondary opacity-50">Leave blank to keep current password</small>
                            </div>

                            <button type="submit" className="btn-custom py-3 px-5" disabled={loading || profileLoading}
                                style={{background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', color: 'white'}}
                            >
                                {loading ? "Saving Changes..." : "Save Profile"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="glass-card p-4">
                        <h5 className="section-title mb-4">
                            <i className="bi bi-gear me-2"></i>
                            System Preferences
                        </h5>
                        <div className="preference-item mb-3">
                            <div className="preference-info">
                                <h6 className="m-0">Email Notifications</h6>
                                <p className="m-0 small text-secondary">Receive alerts for new orders</p>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" defaultChecked />
                            </div>
                        </div>
                        
                        <div className="preference-item mb-3">
                            <div className="preference-info">
                                <h6 className="m-0">Auto-Refresh</h6>
                                <p className="m-0 small text-secondary">Dashboard auto-updates (30s)</p>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" defaultChecked />
                            </div>
                        </div>

                        <div className="preference-item mb-3">
                            <div className="preference-info">
                                <h6 className="m-0">Currency Format</h6>
                                <p className="m-0 small text-secondary">Display prices in USD ($)</p>
                            </div>
                            <span className="badge bg-secondary-subtle text-secondary px-3">USD ($)</span>
                        </div>

                        <div className="divider-modern my-4"></div>

                        <h5 className="section-title mb-4 text-danger">Danger Zone</h5>
                        <button className="btn-custom-outline w-100 border-danger text-danger py-2">
                            Reset All Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
