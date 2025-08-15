import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../lib/api";
import useTheme from "../../store/useTheme";

const User = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [deleteUserTarget, setDeleteUserTarget] = useState(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    const { theme } = useTheme();

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Open View More modal
    const handleViewMore = (user) => {
        setSelectedUser({
            ...user,
            preferred_categories: user.preferred_categories || [],
            preferred_amenities: user.preferred_amenities || [],
            preferred_locations: user.preferred_locations || [],
        });
        setModalMessage("");
        setShowViewModal(true);
    };

    // Open Delete modal
    const handleDeleteClick = (user) => {
        setDeleteUserTarget(user);
        setDeleteConfirmName("");
        setDeleteMessage("");
        setShowDeleteModal(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (!deleteUserTarget) return;

        if (deleteConfirmName.trim() !== deleteUserTarget.full_name) {
            setDeleteMessage("Full name does not match. User not deleted.");
            return;
        }

        try {
            await deleteUser(deleteUserTarget.id);
            setUsers(users.filter((u) => u.id !== deleteUserTarget.id));
            setDeleteMessage(`User ${deleteUserTarget.full_name} deleted successfully!`);
            setDeleteUserTarget(null);
            setTimeout(() => setShowDeleteModal(false), 1500); // auto-close after success
        } catch (error) {
            console.error(error);
            setDeleteMessage("Failed to delete user.");
            setDeleteUserTarget(null);
        }
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedUser(null);
        setModalMessage("");
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteUserTarget(null);
        setDeleteConfirmName("");
        setDeleteMessage("");
    };

    return (
        <div className="min-h-screen p-6 bg-base-100 text-base-content transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-5">User List</h1>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="table w-full border border-base-300">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td className="flex gap-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleViewMore(user)}
                                        >
                                            View More
                                        </button>
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View More Modal */}
            {showViewModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-200 p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-3">User Details</h2>

                        {selectedUser.profileImage && (
                            <img
                                src={selectedUser.profileImage}
                                alt="Profile"
                                className="w-28 h-28 rounded-full mb-4 border-2 border-base-300"
                            />
                        )}

                        <div className="space-y-1">
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Full Name:</strong> {selectedUser.full_name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Verified:</strong> {selectedUser.is_verified ? "Yes" : "No"}</p>
                            <p><strong>DOB:</strong> {selectedUser.dob || "N/A"}</p>
                            <p><strong>Gender:</strong> {selectedUser.gender || "N/A"}</p>
                            <p><strong>City:</strong> {selectedUser.city}</p>
                            <p><strong>District:</strong> {selectedUser.district || "N/A"}</p>
                            <p><strong>State:</strong> {selectedUser.state}</p>
                            <p><strong>Pincode:</strong> {selectedUser.pincode || "N/A"}</p>
                            <p><strong>Affiliation Type:</strong> {selectedUser.affiliation_type || "N/A"}</p>
                            <p><strong>Affiliation Name:</strong> {selectedUser.affiliation_name || "N/A"}</p>
                            <p><strong>Preferred City:</strong> {selectedUser.preferred_city}</p>
                            <p><strong>Preferred District:</strong> {selectedUser.preferred_district || "N/A"}</p>
                            <p><strong>Preferred State:</strong> {selectedUser.preferred_state}</p>
                            <p><strong>Preferred Pincode:</strong> {selectedUser.preferred_pincode || "N/A"}</p>
                            <p><strong>Budget:</strong> {selectedUser.budget || "N/A"}</p>
                            <p><strong>Sharing Preference:</strong> {selectedUser.sharing_preference}</p>
                            <p><strong>Preferred Categories:</strong> {selectedUser.preferred_categories.join(", ") || "N/A"}</p>
                            <p><strong>Preferred Amenities:</strong> {selectedUser.preferred_amenities.join(", ") || "N/A"}</p>
                            <p><strong>Preferred Locations:</strong> {selectedUser.preferred_locations.join(", ") || "N/A"}</p>
                            <p><strong>Created At:</strong> {selectedUser.created_at}</p>
                            <p><strong>Updated At:</strong> {selectedUser.updated_at}</p>
                        </div>

                        <div className="text-center mt-4">
                            <button className="btn btn-secondary" onClick={closeViewModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-200 p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                        {deleteUserTarget ? (
                            <>
                                <h2 className="text-xl font-bold mb-3">Confirm Deletion</h2>
                                <p>Type full name to confirm deletion: <strong>{deleteUserTarget.full_name}</strong></p>
                                <input
                                    type="text"
                                    value={deleteConfirmName}
                                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                                    className="input input-bordered w-full mt-2 mb-4"
                                />
                                {deleteMessage && (
                                    <div className="alert alert-info mb-2">{deleteMessage}</div>
                                )}
                                <div className="flex justify-end gap-2">
                                    <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
                                    <button className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                                </div>
                            </>
                        ) : deleteMessage ? (
                            <div className="alert alert-info">{deleteMessage}</div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
