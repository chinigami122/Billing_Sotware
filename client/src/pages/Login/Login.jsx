import './Login.css';
import {useContext, useState} from "react";
import toast from "react-hot-toast";
import {login} from "../../service/AuthService.js";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../context/AppContext.jsx";
const Login = () =>{
    const { setAuthData } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading , setLoading] = useState(false);
    const [data , setData] = useState({
        email : "",
        password : ""
    })
    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((data) => ({...data , [name] : value}));
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(data);
            if(response.status === 200 ){
                toast.success("Login succefull");
                localStorage.setItem("token" , response.data.token);
                localStorage.setItem("role" , response.data.role);
                setAuthData(response.data.token , response.data.role);
                navigate("/dashboard");
            }

        }catch (error) {
            toast.error("Email or Password invalid");
        }
        finally {
            setLoading(false);
        }
    }
    return(
        <div className="login-page">
            <div className="login-card">
                {/* --- Branding --- */}
                <div className="login-brand">
                    <div className="login-logo-icon">
                        <i className="bi bi-lightning-charge-fill"></i>
                    </div>
                    <h1 className="login-logo-text">
                        Electro<span className="accent">Hub</span>
                    </h1>
                    <p className="login-subtitle">Sign in to access your dashboard</p>
                </div>

                {/* --- Form --- */}
                <form onSubmit={onSubmitHandler}>
                    <div className="login-field">
                        <label htmlFor="email">Email address</label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email" 
                            placeholder="yourname@gmail.com" 
                            onChange={onChangeHandler} 
                            value={data.email}
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="••••••••" 
                            onChange={onChangeHandler} 
                            value={data.password}
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default Login;