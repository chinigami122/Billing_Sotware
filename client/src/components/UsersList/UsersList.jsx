import { useState } from "react";
import toast from "react-hot-toast";
import { deleteUser } from "../../service/UserService.js";
import "./UsersList.css";

const UsersList = ({ users = [], setUsers = () => {} }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        return (
            user?.name?.toLowerCase().includes(term) ||
            user?.email?.toLowerCase().includes(term) ||
            user?.role?.toLowerCase().includes(term)
        );
    });

    const deleteByUser = async (userId) => {
        try {
            const response = await deleteUser(userId);
            if (response.status === 204) {
                setUsers((prev) => prev.filter((user) => user.userId !== userId));
                toast.success("User deleted");
            } else {
                toast.error("Unable to delete user");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete user");
        }
    };

    return (
        <div className="users-list-container" style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        name="keyword"
                        id="keyword"
                        placeholder="Search users"
                        className="form-control"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>

            <div className="row g-3 pe-2">
                {filteredUsers.map((user) => (
                    <div key={user.userId} className="col-12">
                        <div className="card p-3 user-card">
                            <div className="d-flex align-items-center">
                                <div className="user-avatar" aria-hidden="true">
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-grow-1 user-info">
                                    <h5 className="mb-1 text-white">{user.name}</h5>
                                    <p className="mb-0 text-white-50">{user.email}</p>
                                    <span className="badge bg-light text-dark mt-2">{user.role}</span>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteByUser(user.userId)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;