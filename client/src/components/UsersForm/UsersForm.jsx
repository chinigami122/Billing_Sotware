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
        const value = e.target.value;
        const name = e.target.name;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await addUser(data);

            // Adjust status if your backend returns a different one
            if (response.status === 201 || response.status === 200) {
                toast.success("User added");

                // If backend returns created user object, append it
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
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-12 form-container">
                    <div className="card-body">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    placeholder="Jhon Deo"
                                    onChange={onChangeHandler}
                                    value={data.name}
                                />

                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="yourname@gmail.com"
                                    onChange={onChangeHandler}
                                    value={data.email}
                                />

                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="**********"
                                    onChange={onChangeHandler}
                                    value={data.password}
                                />
                                <br />

                                <button
                                    type="submit"
                                    className="btn btn-warning w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Loading" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersForm;
