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
                if (!isMounted) {
                    return;
                }

                setProfileData((prev) => ({
                    ...prev,
                    name: response.data?.name || "",
                    email: response.data?.email || ""
                }));
            } catch (error) {
                if (isMounted) {
                    toast.error("Failed to load profile details");
                }
            } finally {
                if (isMounted) {
                    setProfileLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const getCurrentUserEmailFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return null;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload?.sub || null;
        } catch {
            return null;
        }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const payload = {};
        const trimmedName = profileData.name.trim();
        const trimmedEmail = profileData.email.trim();
        const trimmedPassword = profileData.password.trim();

        if (trimmedName) {
            payload.name = trimmedName;
        }
        if (trimmedEmail) {
            payload.email = trimmedEmail;
        }
        if (trimmedPassword) {
            payload.password = trimmedPassword;
        }

        if (Object.keys(payload).length === 0) {
            toast.error("Please provide at least one field to update");
            return;
        }

        setLoading(true);
        try {
            const currentEmail = getCurrentUserEmailFromToken();
            const response = await updateProfile(payload);

            setProfileData((prev) => ({ ...prev, password: "" }));

            const emailWasChanged =
                payload.email &&
                currentEmail &&
                payload.email.toLowerCase() !== currentEmail.toLowerCase();

            if (emailWasChanged) {
                toast.success("Profile updated. Please sign in again with your new email.");
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
        <div className="settings-container">
            <header className="mb-4">
                <h2 className="text-white m-0 fw-bold">Settings</h2>
                <p className="text-secondary mb-0 mt-2">Update profile and preferences</p>
            </header>

            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <section className="settings-card h-100">
                        <h5 className="text-light mb-3">Profile Settings</h5>
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label text-secondary">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="form-control dark-form-control"
                                    placeholder="Your name"
                                    value={profileData.name}
                                    onChange={onChangeHandler}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-secondary">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-control dark-form-control"
                                    placeholder="yourname@gmail.com"
                                    value={profileData.email}
                                    onChange={onChangeHandler}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label text-secondary">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="form-control dark-form-control"
                                    placeholder="**********"
                                    value={profileData.password}
                                    onChange={onChangeHandler}
                                />
                            </div>

                            <button type="submit" className="btn btn-warning px-4" disabled={loading || profileLoading}>
                                {loading ? "Saving..." : profileLoading ? "Loading..." : "Save Changes"}
                            </button>
                        </form>
                    </section>
                </div>

                <div className="col-12 col-lg-5">
                    <section className="settings-card h-100">
                        <h5 className="text-light mb-3">System Preferences</h5>
                        <div className="settings-preference">
                            <span className="text-light">Email Notifications</span>
                            <span className="badge bg-secondary">Enabled</span>
                        </div>
                        <div className="settings-preference">
                            <span className="text-light">Auto Refresh Orders</span>
                            <span className="badge bg-secondary">Every 30 sec</span>
                        </div>
                        <div className="settings-preference">
                            <span className="text-light">Currency</span>
                            <span className="badge bg-secondary">USD</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;

