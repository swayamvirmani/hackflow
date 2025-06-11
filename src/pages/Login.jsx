import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; // ✅ Google icon
import Toast from '../components/Toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();
    const { loginWithEmailAndPassword, loginWithGoogle, user } = useFirebase(); // ✅ include loginWithGoogle

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await loginWithEmailAndPassword(formData.email, formData.password);
            setToast({ message: `Welcome back! 👋`, type: 'success' });
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    // ✅ Handle Google Sign-In
    const handleGoogleLogin = async () => {
        setError('');
        try {
            await loginWithGoogle();
            setToast({ message: `Welcome back! 👋`, type: 'success' });
        } catch (err) {
            console.error("Google login failed:", err);
            setError('Google login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-bold text-[#01FF00]">
                        Login to HackYours
                    </h2>
                    <p className="mt-2 text-center text-sm text-white/60">
                        Or{' '}
                        <Link to="/signup" className="text-[#01FF00] hover:text-[#01FF00]/80 cursor-pointer">
                            create a new account
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
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border-2 border-[#01FF00]/40 bg-black text-white placeholder-[#01FF00]/50 focus:outline-none focus:border-[#01FF00] focus:ring-1 focus:ring-[#01FF00] hover:border-[#01FF00]/60 transition-all duration-300 cursor-text"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border-2 border-[#01FF00]/40 bg-black text-white placeholder-[#01FF00]/50 focus:outline-none focus:border-[#01FF00] focus:ring-1 focus:ring-[#01FF00] hover:border-[#01FF00]/60 transition-all duration-300 cursor-text"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-[#01FF00]/70 hover:text-[#01FF00] focus:outline-none cursor-pointer"
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center cursor-pointer group">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-[#01FF00] border-2 border-[#01FF00]/40 bg-black rounded focus:ring-[#01FF00] cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#01FF00]/80 group-hover:text-[#01FF00] cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link 
                                to="/forgot-password" 
                                className="text-[#01FF00] hover:text-[#01FF00]/80 cursor-pointer hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent rounded-lg text-black bg-[#01FF00] hover:bg-[#01FF00]/90 focus:outline-none transition-all duration-300 hover:shadow-lg hover:shadow-[#01FF00]/20 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                {/* ✅ Google Login Button */}
                <div className="text-center mt-4">
                    <p className="text-white/60 mb-2">or</p>
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="group relative w-full flex justify-center items-center py-3 px-4 border-2 border-[#01FF00]/40 rounded-lg text-[#01FF00] hover:bg-[#01FF00]/10 focus:outline-none transition-all duration-300 hover:shadow-md hover:shadow-[#01FF00]/30 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        <FcGoogle className="mr-2 text-xl" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
