import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Link } from 'react-router';
import LoginImage from '../assets/Login_CampusConnect.png';
import useLogin from '../hooks/useLogin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState(false);

    const { isPending, loginMutation } = useLogin();

    const handleLogin = (e) => {
        e.preventDefault();

        loginMutation({email, password });
        setEmail('');
        setPassword('');
        // setRememberMe(false);
    }

    return (
        <div className="min-h-screen flex bg-base-100">
            {/* Left Image Section */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-base-100">
                <img src={LoginImage} alt="Campus Connect Login" className="max-w-2xl p-10" />
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 shadow-xl bg-base-200/50">
                <div className="w-full max-w-lg space-y-6 shadow-xl px-8 py-4 rounded-md bg-base-100">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-base-content">Sign In</h1>
                        <p className="text-base-content/70">Access your CampusConnect account</p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => { handleLogin(e); }}>
                        {/* Email */}
                        <div className="form-control">
                            <label className="label" htmlFor="email">
                                <span className="label-text">Email</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Mail className="w-5 h-5 text-base-content/60" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="grow bg-transparent"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Lock className="w-5 h-5 text-base-content/60" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="grow bg-transparent"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        {/* Remember Me */}
                        {/* <div className="flex items-center justify-between">
                            <label className="cursor-pointer label gap-2">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="label-text">Remember me</span>
                            </label>
                        </div> */}

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                            {
                                isPending
                                ? (
                                <>
                                    <span className="loading loading-dots loading-md"></span>
                                    Signing in...
                                </>
                                )
                                : ('Sign In')
                            }
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="text-center">
                        <p className="text-sm text-base-content/70">
                            Don&apos;t have an account?{' '}
                            <Link to="/signup" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
