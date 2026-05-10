import { useState } from "react";
import toast from "react-hot-toast";
import { deleteUser } from "../../service/UserService.js";
import "./UsersList.css";

const UsersList = ({ users = [], setUsers = () => {}, loading = false }) => {
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
        if (!window.confirm("Are you sure you want to remove this team member?")) return;
        
        try {
            const response = await deleteUser(userId);
            if (response.status === 204) {
                setUsers((prev) => prev.filter((user) => user.userId !== userId));
                toast.success("User removed from team");
            } else {
                toast.error("Unable to delete user");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete user");
        }
    };

    return (
        <div className="users-list-container-modern">
            <div className="search-header-modern mb-4">
                <div className="input-group-custom">
                    <i className="bi bi-search input-icon-custom"></i>
                    <input
                        type="text"
                        placeholder="Search team members..."
                        className="input-custom-field"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                </div>
            </div>

            <div className="users-scroll-area">
                {filteredUsers.map((user) => (
                    <div key={user.userId} className="glass-card user-horizontal-card mb-3">
                        <div className="user-avatar-mini">
                            {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="user-info-extended">
                            <div className="user-main-details">
                                <h6 className="user-title">{user.name}</h6>
                                <span className="user-email-text">{user.email}</span>
                            </div>
                            
                            <div className="user-role-badge">
                                {user.role?.replace('ROLE_', '')}
                            </div>
                        </div>

                        <div className="user-actions-panel">
                            <button 
                                className="btn-action delete" 
                                title="Delete"
                                onClick={() => deleteByUser(user.userId)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-5 opacity-50">
                        <i className="bi bi-people fs-1 mb-2"></i>
                        <p>No team members found</p>
                    </div>
                )}
                
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-accent-primary" role="status"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersList;