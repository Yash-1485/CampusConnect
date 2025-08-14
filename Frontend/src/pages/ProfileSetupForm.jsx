import { useState, useEffect } from 'react';
import useUpdateUser from '../hooks/useUpdateUser';
import useUser from '../hooks/useUser';
import { toast } from 'react-toastify';
import { ArrowRight, Plus, UserRoundCheck, X } from "lucide-react";
import { AMENITY_CHOICES, CATEGORY_CHOICES } from '../constants/constants';

const ProfileSetupForm = () => {
    const { user, isLoading: isUserLoading } = useUser();
    const { mutate: updateUser, isPending } = useUpdateUser();
    const [step, setStep] = useState(1);
    const [isStepValid, setIsStepValid] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        dob: '',
        gender: '',
        profileImage: null,
        city: '',
        district: '',
        state: '',
        pincode: '',
        preferred_city: '',
        preferred_district: '',
        preferred_state: '',
        preferred_pincode: '',
        affiliation_type: '',
        affiliation_name: '',
        budget: '',
        preferred_categories: [],
        sharing_preference: 'any',
        preferred_amenities: [],
        preferred_locations: [],
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(user?.profileImage);
    // Initialize form with user data
    useEffect(() => {
        if (user && !isUserLoading) {
            setFormData(prev => ({
                ...prev,
                ...user,
                full_name: user.full_name || '',
                phone: user.phone || '',
                preferred_categories: user.preferred_categories || [],
                preferred_amenities: user.preferred_amenities || []
            }));
            setImagePreview(user.profileImage || '/default-profile.png');
        }
    }, [user, isUserLoading]);

    // Added Later - For continuous let user know which error is occured
    // useEffect(() => {
    //     validateStep(step);
    // }, [formData,step]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter(item => item !== value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateStep = (stepNum) => {
        const newErrors = {};

        // Step 1: Personal Info
        if (stepNum === 1) {
            if (!formData.full_name?.trim()) newErrors.full_name = 'Full name is required';
            if (!formData.dob) newErrors.dob = 'Date of birth is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
            if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
            else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
        }

        // Step 2: Current Location
        if (stepNum === 2) {
            if (!formData.city?.trim()) newErrors.city = 'City is required';
            if (!formData.district?.trim()) newErrors.district = 'District is required';
            if (!formData.state?.trim()) newErrors.state = 'State is required';
            if (!formData.pincode?.trim()) newErrors.pincode = 'Pincode is required';
            else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';
        }

        // Step 3: Preferred Location
        if (stepNum === 3) {
            if (!formData.preferred_city?.trim()) newErrors.preferred_city = 'Preferred city is required';
            if (!formData.preferred_state?.trim()) newErrors.preferred_state = 'Preferred state is required';
            if (!formData.preferred_district?.trim()) newErrors.preferred_district = 'Preferred district is required';
            if (!formData.preferred_pincode?.trim()) newErrors.preferred_pincode = 'Preferred pincode is required';

            // Validate preferred_locations
            if (!formData.preferred_locations || formData.preferred_locations.length === 0) {
                newErrors.preferred_locations = 'Add at least 1 preferred location';
            } else {
                const emptyLocations = formData.preferred_locations.some(loc => !loc.trim());
                if (emptyLocations) {
                    newErrors.preferred_locations = 'All locations must be filled';
                }
            }
        }

        // Step 4: Preferences
        if (stepNum === 4) {
            if (!formData.budget) newErrors.budget = 'Budget is required';
            else if (formData.budget < 1000) newErrors.budget = 'Budget too low';
            if (formData.preferred_categories.length === 0) newErrors.preferred_categories = 'Select at least one category';
            if (formData.preferred_amenities.length === 0) newErrors.preferred_amenities = 'Select at least one amenity';
        }

        // setErrors(newErrors);
        // return Object.keys(newErrors).length === 0;

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        setIsStepValid(isValid);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(step) || isStepValid) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        try {
            const formDataToSend = new FormData();
            if (!(formData.profileImage instanceof File)) {
                delete formData.profileImage;
            }
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(val => formDataToSend.append(key, val));
                    } else if (value instanceof File) {
                        formDataToSend.append(key, value);
                    } else {
                        formDataToSend.append(key, value);
                    }
                }
            });
            await updateUser(formDataToSend);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
            console.log(error)
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Personal Information</h3>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={`input input-bordered w-full ${errors.full_name ? 'input-error' : ''}`}
                            />
                            {errors.full_name && <span className="text-error text-sm">{errors.full_name}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                                maxLength="10"
                            />
                            {errors.phone && <span className="text-error text-sm">{errors.phone}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date of Birth</span>
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob || ''}
                                onChange={handleChange}
                                className={`input input-bordered w-full ${errors.dob ? 'input-error' : ''}`}
                            />
                            {errors.dob && <span className="text-error text-sm">{errors.dob}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Gender</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleChange}
                                className={`select select-bordered w-full ${errors.gender ? 'select-error' : ''}`}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <span className="text-error text-sm">{errors.gender}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Image</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-16 rounded-full">
                                        <img src={imagePreview} alt="Profile Preview" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    name="profileImage"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="file-input file-input-bordered w-full max-w-xs"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Current Location</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">City</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${errors.city ? 'input-error' : ''}`}
                                />
                                {errors.city && <span className="text-error text-sm">{errors.city}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">District</span>
                                </label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district || ''}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${errors.district ? 'input-error' : ''}`}
                                />
                                {errors.district && <span className="text-error text-sm">{errors.district}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">State</span>
                                </label>
                                <select name="state" value={formData.state || ''} onChange={handleChange} className={`select select-bordered w-full ${errors.state ? 'select-error' : ''}`}>
                                    <option value="">Select State</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Rajsthan">Rajsthan</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Karnataka">Karnataka</option>
                                </select>
                                {errors.state && <span className="text-error text-sm">{errors.state}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Pincode</span>
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode || ''}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${errors.pincode ? 'input-error' : ''}`}
                                    maxLength="6"
                                />
                                {errors.pincode && <span className="text-error text-sm">{errors.pincode}</span>}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Preferred Location</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Preferred City</span>
                                </label>
                                <input
                                    type="text"
                                    name="preferred_city"
                                    value={formData.preferred_city || ''}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${errors.preferred_city ? 'input-error' : ''}`}
                                />
                                {errors.preferred_city && <span className="text-error text-sm">{errors.preferred_city}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Preferred District</span>
                                </label>
                                <input
                                    type="text"
                                    name="preferred_district"
                                    value={formData.preferred_district || ''}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${errors.preferred_district ? 'input-error' : ''}`}
                                />
                                {errors.preferred_district && <span className="text-error text-sm">{errors.preferred_district}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Preferred State</span>
                                </label>
                                <select
                                    name="preferred_state"
                                    value={formData.preferred_state || ''}
                                    onChange={handleChange}
                                    className={`select select-bordered w-full ${errors.preferred_state ? 'select-error' : ''}`}
                                >
                                    <option value="">Select State</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Rajsthan">Rajsthan</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Karnataka">Karnataka</option>
                                </select>
                                {errors.preferred_state && <span className="text-error text-sm">{errors.preferred_state}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Preferred Pincode</span>
                                </label>
                                <input
                                    type="text"
                                    name="preferred_pincode"
                                    value={formData.preferred_pincode || ''}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${errors.preferred_pincode ? 'input-error' : ''}`}
                                    maxLength="6"
                                />
                                {errors.preferred_pincode && <span className="text-error text-sm">{errors.preferred_pincode}</span>}
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Affiliation Type</span>
                            </label>
                            <select
                                name="affiliation_type"
                                value={formData.affiliation_type || ''}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Type</option>
                                <option value="institution">Institution</option>
                                <option value="organization">Organization</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Affiliation Name</span>
                            </label>
                            <input
                                type="text"
                                name="affiliation_name"
                                value={formData.affiliation_name || ''}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="label">
                                <span className="label-text">Preferred Locations</span>
                            </label>
                            {formData.preferred_locations?.map((location, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => {
                                            const newLocations = [...formData.preferred_locations];
                                            newLocations[index] = e.target.value.trim();
                                            setFormData({ ...formData, preferred_locations: newLocations });
                                        }}
                                        className="input input-bordered input-sm w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newLocations = formData.preferred_locations.filter((_, i) => i !== index);
                                            setFormData({ ...formData, preferred_locations: newLocations });
                                        }}
                                        className="btn btn-square btn-sm btn-error"
                                    >
                                        <X />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        preferred_locations: [...(formData.preferred_locations || []), ""]
                                    });
                                }}
                                className={`btn btn-sm btn-outline mt-2 ${(formData.preferred_locations?.length || 0) >= 5 ? 'btn-disabled opacity-50 cursor-not-allowed' : ''}`}
                                disabled={(formData.preferred_locations?.length || 0) >= 5}
                            >
                                <Plus />
                                Add Location
                            </button>
                            {errors.preferred_locations && (
                                <span className="text-error text-sm">{errors.preferred_locations}</span>
                            )}
                        </div>
                    </div >
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Preferences</h3>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Monthly Budget (₹)</span>
                            </label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget || ''}
                                onChange={handleChange}
                                className={`input input-bordered w-full ${errors.budget ? 'input-error' : ''}`}
                                min="1000"
                            />
                            {errors.budget && <span className="text-error text-sm">{errors.budget}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Room Type Preference</span>
                            </label>
                            <select
                                name="sharing_preference"
                                value={formData.sharing_preference || 'any'}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="private">Private Room</option>
                                <option value="shared">Shared Room</option>
                                <option value="any">Any</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Preferred Categories</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {CATEGORY_CHOICES.map(([value, label]) => (
                                    <label key={value} className="label cursor-pointer justify-start gap-2">
                                        <input
                                            type="checkbox"
                                            name="preferred_categories"
                                            value={value}
                                            checked={formData.preferred_categories.includes(value)}
                                            onChange={handleChange}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">{label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.preferred_categories && (
                                <span className="text-error text-sm">{errors.preferred_categories}</span>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Preferred Amenities</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {AMENITY_CHOICES.map(([value, label]) => (
                                    <label key={value} className="label cursor-pointer justify-start gap-2">
                                        <input
                                            type="checkbox"
                                            name="preferred_amenities"
                                            value={value}
                                            checked={formData.preferred_amenities.includes(value)}
                                            onChange={handleChange}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">{label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.preferred_amenities && <span className="text-error text-sm">{errors.preferred_amenities}</span>}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="card bg-base-100 shadow-xl max-w-3xl mx-auto">
                <div className="card-body">
                    <h2 className="card-title text-3xl mb-6">Complete Your Profile</h2>

                    {/* Progress Steps */}
                    <ul className="steps steps-horizontal mb-8">
                        {[1, 2, 3, 4].map((stepNum) => (
                            <li key={stepNum} className={`step ${stepNum < step ? 'step-primary' : ''} ${stepNum === step ? 'step-primary font-bold' : ''}`}>
                                {stepNum === 1 && 'Personal'}
                                {stepNum === 2 && 'Location'}
                                {stepNum === 3 && 'Preferences'}
                                {stepNum === 4 && 'Amenities'}
                            </li>
                        ))}
                    </ul>

                    {/* Form Content */}
                    <form onSubmit={(e) => e.preventDefault()}>
                        {renderStep()}

                        <div className="flex justify-between mt-8">
                            {step > 1 && (
                                <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                                    Previous
                                </button>
                            )}

                            <div className="ml-auto">
                                {step < 4 ? (
                                    <button
                                        type="button"
                                        // className={`btn btn-primary ${!isStepValid ? 'btn-disabled opacity-50' : ''}`}
                                        className={`btn btn-primary`}
                                        onClick={handleNext}
                                    // disabled={!isStepValid}
                                    >
                                        Next
                                        <ArrowRight />
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-success" onClick={handleSubmit} disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                Complete Profile
                                                <UserRoundCheck />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetupForm;