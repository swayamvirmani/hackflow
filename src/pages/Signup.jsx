import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const {
        loginWithEmailAndPassword,
        loginWithGoogle,
        signupUserWithEmailAndPassword,
        putData,
        user
    } = useFirebase();
    

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const navigate = useNavigate();
  

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const userCredential = await signupUserWithEmailAndPassword(formData.email, formData.password);
            await putData(`users/${userCredential.user.uid}`, {
                name: formData.name,
                email: formData.email,
                createdAt: new Date().toISOString()
            });
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already registered');
            } else {
                setError('Failed to create account. Please try again.');
            }
        }
    };
    const handleGoogleLogin = async () => {
        setError('');
        try {
            const user = await loginWithGoogle();
            console.log("Google login successful:", user);
            navigate('/', { replace: true });
        } catch (err) {
            console.error("Google login failed:", err);
            setError('Google login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-bold text-[#01FF00]">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-white/60">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#01FF00] hover:text-[#01FF00]/80 cursor-pointer">
                            Sign in
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border-2 border-[#01FF00]/40 bg-black text-white placeholder-[#01FF00]/50 focus:outline-none focus:border-[#01FF00]"
                                placeholder="Full Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border-2 border-[#01FF00]/40 bg-black text-white placeholder-[#01FF00]/50 focus:outline-none focus:border-[#01FF00]"
                                placeholder="Email address"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border-2 border-[#01FF00]/40 bg-black text-white placeholder-[#01FF00]/50 focus:outline-none focus:border-[#01FF00]"
                                placeholder="Password"
                            />
                           

                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-[#01FF00]/70 hover:text-[#01FF00]"
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border-2 border-[#01FF00]/40 bg-black text-white placeholder-[#01FF00]/50 focus:outline-none focus:border-[#01FF00]"
                                placeholder="Confirm Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-[#01FF00]/70 hover:text-[#01FF00]"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent rounded-lg text-black bg-[#01FF00] hover:bg-[#01FF00]/90 focus:outline-none transition-all duration-300 hover:shadow-lg hover:shadow-[#01FF00]/20 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            Create Account
                        </button>
                    </div>

                </form>
                <div className="text-center mt-4">
                    <p className="text-white/60 mb-2">or</p>
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="group relative w-full flex justify-center items-center py-3 px-4 border-2 border-[#01FF00]/40 rounded-lg text-[#01FF00] hover:bg-[#01FF00]/10 focus:outline-none transition-all duration-300 hover:shadow-md hover:shadow-[#01FF00]/30 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        <FcGoogle className="mr-2 text-xl" />
                        Sign up with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
