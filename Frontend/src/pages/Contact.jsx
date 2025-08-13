import React from 'react';
import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
    const [contactformData, setContactFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        category: '',
        consent: false,
    });

    const [errors, setErrors] = useState({});

    const namePattern = /^[A-Za-z\s]{2,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value.trim()) return "Name is required";
                if (!namePattern.test(value))
                    return "Name must contain only letters and be at least 2 characters";
                break;
            case "email":
                if (!value.trim()) return "Email is required";
                if (!emailPattern.test(value)) return "Please enter valid Email";
                break;
            case "phone":
                if (!value.trim()) return "Phone number is required";
                if (!phonePattern.test(value))
                    return "Please enter valid Phone number";
                break;
            case "consent":
                if (!value)
                    return "You must agree to the terms & privacy policy before submitting";
                break;
            default:
                return "";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const updatedValue = type === "checkbox" ? checked : value;

        setContactFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, updatedValue),
        }));
    };

    const validateData = () => {
        let newErrors = {};
        for (let key in contactformData) {
            const error = validateField(key, contactformData[key]);
            if (error) newErrors[key] = error;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateData()) {
            toast.success("Form submitted successfully!");
            console.log("Form Data:", contactformData);
        } else {
            toast.error("Please enter valid data before submitting.");
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <form
                    className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>

                    <div className="form-control mb-4">
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full"
                            value={contactformData.name}
                            onChange={handleChange}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div className="form-control mb-4">
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full"
                            value={contactformData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="form-control mb-4">
                        <label className="block mb-1 font-medium">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={contactformData.phone}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    <div className="form-control mb-4">
                        <label className="block mb-1 font-medium">Message</label>
                        <textarea
                            name="message"
                            className="textarea textarea-bordered w-full"
                            rows="4"
                            value={contactformData.message}
                            onChange={handleChange}
                        ></textarea>
                    </div>


                    <div className="form-control mb-4">
                        <label className="block mb-1 font-medium">Category</label>
                        <select
                            name="category"
                            className="select select-bordered w-full"
                            value={contactformData.category}
                            onChange={handleChange}
                        >
                            <option value="" hidden>Select category</option>
                            <option value="general">General Inquiry</option>
                            <option value="feedback">Feedback/Suggestion</option>
                            <option value="technical">Technical Issue</option>
                            <option value="partnership">Partnership/Collaboration</option>
                        </select>
                    </div>

                    <div className="form-control mb-4">
                        <label className="cursor-pointer flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={contactformData.consent}
                                onChange={handleChange}
                                className="checkbox"
                            />
                            <span>I agree to the terms & privacy policy.</span>
                        </label>
                        {errors.consent && (
                            <p className="text-red-500 text-sm mt-1">{errors.consent}</p>
                        )}
                    </div>

                    <button className="btn btn-primary w-full" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}

export default Contact;