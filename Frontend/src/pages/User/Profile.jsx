import { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import axiosInstance from '../../lib/axios';
// import useTheme from '../../store/useTheme';

const Profile = () => {
    const { user, isLoading, refreshUser } = useUser();
    // const { theme } = useTheme();

    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({});
            setImagePreview(user.profileImage || null);
        }
    }, [user]);

    const toggleUpdateForm = () => setShowUpdateForm(!showUpdateForm);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCheckboxChange = (name, value) => {
        const selected = formData[name] || [...(user[name] || [])];
        if (selected.includes(value)) {
            selected.splice(selected.indexOf(value), 1);
        } else {
            selected.push(value);
        }
        setFormData({ ...formData, [name]: selected });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => payload.append(key, v));
                } else {
                    payload.append(key, value);
                }
            }
        });

        try {
            await axiosInstance.put('auth/profile/update/', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Profile updated successfully!');
            setFormData({});
            setShowUpdateForm(false);
            refreshUser();

        } catch (err) {
            console.error(err.response?.data || err);
            alert('Failed to update profile.');
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (!user) return <div className="text-center py-20">No user data found.</div>;

    return (
        <div className="min-h-screen p-6 bg-base-100 text-base-content transition-colors duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-center">User Profile</h2>

            {/* Profile Card */}
            <div className="max-w-md mx-auto card bg-base-200 shadow-md rounded-lg p-6 flex flex-col items-center space-y-3">
                {imagePreview && (
                    <div className="avatar">
                        <div className="w-28 h-28 rounded-full border-2 border-base-300">
                            <img src={imagePreview} alt="Profile" />
                        </div>
                    </div>
                )}
                <div className="text-center space-y-1">
                    <p><span className="font-medium">ID:</span> {user.id}</p>
                    <p><span className="font-medium">Full Name:</span> {user.full_name}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Phone:</span> {user.phone}</p>
                </div>
            </div>

            {/* Toggle Update Form */}
            <div className="text-center mt-6">
                <button
                    onClick={toggleUpdateForm}
                    className="btn btn-primary"
                >
                    {showUpdateForm ? 'Close Form' : 'Update Details'}
                </button>
            </div>

            {/* Update Form */}
            {showUpdateForm && (
                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto mt-6 card bg-base-200 shadow-md rounded-lg p-6 space-y-4"
                >
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Profile Image:</label>
                        <input type="file" name="profileImage" onChange={handleChange} className="file-input file-input-bordered w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="full_name" defaultValue={user.full_name} onChange={handleChange} placeholder="Full Name" className="input input-bordered w-full" />
                        <input type="text" name="phone" defaultValue={user.phone} onChange={handleChange} placeholder="Phone" className="input input-bordered w-full" />
                        <input type="email" name="email" defaultValue={user.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full" />
                        <input type="date" name="dob" defaultValue={user.dob || ''} onChange={handleChange} className="input input-bordered w-full" />
                        <input type="text" name="city" defaultValue={user.city} onChange={handleChange} placeholder="City" className="input input-bordered w-full" />
                        <input type="text" name="district" defaultValue={user.district} onChange={handleChange} placeholder="District" className="input input-bordered w-full" />
                        <input type="text" name="state" defaultValue={user.state} onChange={handleChange} placeholder="State" className="input input-bordered w-full" />
                        <input type="text" name="pincode" defaultValue={user.pincode} onChange={handleChange} placeholder="Pincode" className="input input-bordered w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="gender" value={formData.gender || user.gender || ''} onChange={handleChange} className="select select-bordered w-full">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="number" name="budget" defaultValue={user.budget} onChange={handleChange} placeholder="Budget" className="input input-bordered w-full" />
                    </div>

                    {/* Preferred Categories */}
                    <div className="flex flex-wrap gap-3">
                        <span className="font-medium w-full">Preferred Categories:</span>
                        {['pg', 'hostel', 'mess', 'tiffin', 'tutor'].map((cat) => (
                            <label key={cat} className="flex items-center gap-2">
                                <input type="checkbox" value={cat} checked={(formData.preferred_categories || user.preferred_categories || []).includes(cat)} onChange={() => handleCheckboxChange('preferred_categories', cat)} className="checkbox checkbox-primary" />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>

                    {/* Preferred Amenities */}
                    <div className="flex flex-wrap gap-3">
                        <span className="font-medium w-full">Preferred Amenities:</span>
                        {['wifi', 'ac', 'laundry', 'attached_bathroom', 'meals', 'housekeeping', 'parking', 'cctv', 'study_table', 'wardrobe', 'water', 'security', 'power_backup', 'fridge', 'tv', 'geyser'].map((amenity) => (
                            <label key={amenity} className="flex items-center gap-2">
                                <input type="checkbox" value={amenity} checked={(formData.preferred_amenities || user.preferred_amenities || []).includes(amenity)} onChange={() => handleCheckboxChange('preferred_amenities', amenity)} className="checkbox checkbox-primary" />
                                <span>{amenity}</span>
                            </label>
                        ))}
                    </div>

                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-success">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
