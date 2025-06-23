import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import Logo from '../assets/Logos/Logo-Green-Darkmode.png';
import { FiMenu, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useFirebase();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

    return (
        <nav className="bg-hero-gradient bg-gradient-to-r from-primary-500 to-secondary-300 shadow-lg border-b border-primary-200/40 sticky top-0 z-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        {/* <img src={Logo} alt="HackFlow Logo" className="h-10 mr-2 transition-all duration-300" /> */}
                        <span className="text-2xl font-bold text-primary-700 drop-shadow hidden sm:inline">HackFlow</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {user ? (
                            <>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Link
                                        to="/ideaGenerator"
                                        className="text-lg font-semibold text-primary-700 hover:text-primary-900 transition-all duration-300"
                                    >
                                        Generate Ideas
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Link
                                        to="/pitchGenerator"
                                        className="text-lg font-semibold text-primary-700 hover:text-primary-900 transition-all duration-300"
                                    >
                                        Generate Pitch
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Link
                                        to="/my-ideas"
                                        className="text-lg font-semibold text-primary-700 hover:text-primary-900 transition-all duration-300"
                                    >
                                        My Ideas
                                    </Link>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={handleLogout}
                                    className="ml-4 px-4 py-2 border-2 border-primary-200 text-primary-700 rounded-lg hover:bg-primary-200/40 cursor-pointer hover:text-primary-900 transition-all"
                                >
                                    Logout
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 border-2 border-primary-200 text-primary-700 rounded-lg hover:bg-primary-200/10 transition-all duration-300 hover:scale-105"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-primary-200 text-primary-700 font-semibold rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-105"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Icon */}
                    {user && (
                        <motion.button
                            className="lg:hidden cursor-pointer text-primary-700 text-2xl"
                            onClick={toggleMobileMenu}
                            initial={{ rotate: 0 }}
                            animate={{ rotate: mobileMenuOpen ? 45 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {mobileMenuOpen ? <FiX /> : <FiMenu />}
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && user && (
                    <motion.div
                        key="mobileMenu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden px-4 pt-4 pb-6 space-y-5 bg-black border-t border-primary-200/40 shadow-lg z-40"
                    >
                        <Link
                            to="/ideaGenerator"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center text-2xl font-semibold text-primary-700 py-2 rounded-lg border border-primary-200/40 bg-primary-200/5 hover:bg-primary-200/10 hover:shadow-[0_0_10px_#FFD700] transition-all"
                        >
                            Generate Ideas
                        </Link>

                        <Link
                            to="/pitchGenerator"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center text-2xl font-semibold text-primary-700 py-2 rounded-lg border border-primary-200/40 bg-primary-200/5 hover:bg-primary-200/10 hover:shadow-[0_0_10px_#FFD700] transition-all"
                        >
                            Generate Pitch
                        </Link>

                        <Link
                            to="/my-ideas"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center text-2xl font-semibold text-primary-700 py-2 rounded-lg border border-primary-200/40 bg-primary-200/5 hover:bg-primary-200/10 hover:shadow-[0_0_10px_#FFD700] transition-all"
                        >
                            My Ideas
                        </Link>

                        <button
                            onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full text-center text-xl font-semibold text-primary-700 py-2 rounded-lg border border-primary-200/30 bg-primary-200/10 hover:bg-primary-200/20 transition-all  hover:shadow-[0_0_10px_#FFD700]"
                        >
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
