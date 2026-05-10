import { useState } from "react";
import toast from "react-hot-toast";
import { addUser } from "../../service/UserService.js";

const DEFAULT_ROLE = "ROLE_USER";
const getInitialUserData = () => ({
    name: "",
    email: "",
    password: "",
    role: DEFAULT_ROLE
});

const UsersForm = ({ setUsers }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(getInitialUserData);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await addUser(data);
            if (response.status === 201 || response.status === 200) {
                toast.success("Team member added");
                if (response.data) {
                    setUsers((prev) => [...prev, response.data]);
                }
                setData(getInitialUserData());
            }
        } catch (error) {
            console.error(error);
            toast.error("Error adding user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-4 form-card-modern">
            <h5 className="mb-4 fw-bold">Add Team Member</h5>
            <form onSubmit={onSubmitHandler}>
                <div className="form-group-modern mb-3">
                    <label className="label-modern">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="input-custom"
                        placeholder="e.g. John Doe"
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.name}
                        required
                    />
                </div>

                <div className="form-group-modern mb-3">
                    <label className="label-modern">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        className="input-custom"
                        placeholder="email@example.com"
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.email}
                        required
                    />
                </div>

                <div className="form-group-modern mb-4">
                    <label className="label-modern">Initial Password</label>
                    <input
                        type="password"
                        name="password"
                        className="input-custom"
                        placeholder="••••••••"
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.password}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn-custom w-100 py-3 mt-2"
                    disabled={loading}
                    style={{background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', color: 'white'}}
                >
                    <i className="bi bi-person-plus me-2"></i>
                    {loading ? "Adding..." : "Add Member"}
                </button>
            </form>
        </div>
    );
};

export default UsersForm;
