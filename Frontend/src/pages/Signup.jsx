import { useState } from 'react';
import { User, Mail, Lock, Phone } from 'lucide-react';
// import SignupImage from '../assets/Signup_CampusConnect.png';
import SignupImage from '../assets/Signup_CampusConnect_New_Edition.png';
import { Link } from 'react-router';
import useSignup from '../hooks/useSignup';
import { toast } from 'react-toastify';

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        acceptTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const { signupMutation, isPending } = useSignup();

    const handleSignup = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match', { autoClose: 1500 });
            return;
        }

        if (!formData.acceptTerms) {
            toast.error('Please accept the terms and conditions', { autoClose: 1500 });
            return;
        }

        signupMutation({ ...formData, role: "user" });
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Image */}
            <div className="hidden lg:flex w-1/2 bg-base-100 items-center justify-center p-10">
                <img src={SignupImage} alt="Signup CampusConnect" className="max-w-full h-auto" />
            </div>

            {/* Right Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-base-100 p-6 shadow-xl bg-base-200/50">
                <div className="w-full max-w-lg shadow-xl px-8 py-4 rounded-md bg-base-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-base-content">Create Account</h1>
                        <p className="text-sm text-base-content/60">Get started with your free account</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { handleSignup(e); }}>
                        {/* Full Name */}
                        <div className="form-control">
                            <label htmlFor="full_name" className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <User className="size-5 text-base-content/50" />
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="grow"
                                    placeholder="John Doe"
                                    required
                                />
                            </label>
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label htmlFor="email" className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Mail className="size-5 text-base-content/50" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="grow"
                                    placeholder="johndoe@example.com"
                                    required
                                />
                            </label>
                        </div>

                        {/* Phone */}
                        <div className="form-control">
                            <label htmlFor="phone" className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Phone className="size-5 text-base-content/50" />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="grow"
                                    placeholder="+91 1234567890"
                                />
                            </label>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label htmlFor="password" className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Lock className="size-5 text-base-content/50" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="grow"
                                    placeholder="••••••••"
                                    required
                                />
                            </label>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-control">
                            <label htmlFor="confirmPassword" className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Lock className="size-5 text-base-content/50" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="grow"
                                    placeholder="••••••••"
                                    required
                                />
                            </label>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="form-control flex-row items-center gap-2">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="checkbox checkbox-primary"
                                required
                            />
                            <label htmlFor='acceptTerms' className="label cursor-pointer flex items-start gap-2">
                                <span className="label-text text-sm text-base-content text-left block">
                                    I agree to the
                                    <a href="#" className="text-primary hover:underline ml-1">Terms of Service</a>
                                    {' '}and
                                    <a href="#" className="text-primary hover:underline ml-1">Privacy Policy</a>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full">
                            {
                                isPending
                                    ? (
                                        <>
                                            <span className="loading loading-dots loading-md"></span>
                                            SigningUp...
                                        </>
                                    ) : (
                                        'Sign up'
                                    )
                            }
                        </button>

                        {/* Already have account */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-base-content">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
