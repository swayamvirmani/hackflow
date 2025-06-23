import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '../context/firebase';

const Welcome = ({ onClose }) => {
    const { user } = useFirebase();
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/80 backdrop-blur-sm font-sans"
            >
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/90 border border-primary-200 p-8 rounded-xl shadow-xl max-w-md w-full mx-4"
                >
                    {user?.photoURL && (
                        <motion.img
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            src={user.photoURL}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-primary-200"
                        />
                    )}
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-bold text-center text-primary-700 mb-2"
                    >
                        Welcome{user?.displayName ? `, ${user.displayName}` : ''}! 👋
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-primary-900/70"
                    >
                        Ready to create your next amazing hackathon project?
                    </motion.p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Welcome;