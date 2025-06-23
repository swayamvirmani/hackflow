import { FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-hero-gradient bg-gradient-to-r from-primary-500 to-secondary-300 border-t border-primary-200/40 font-sans shadow-inner">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold text-primary-700">HackFlow</span>
                        <p className="mt-2 text-primary-900/80">
                            AI-powered hackathon idea generator
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a href="https://github.com/swayamvirmani" target="_blank" rel="noopener noreferrer" 
                            className="text-primary-700/80 hover:text-primary-900">
                            <FiGithub className="w-6 h-6" />
                        </a>
                        <a href="https://github.com/swayamvirmani" target="_blank" rel="noopener noreferrer" 
                            className="text-primary-700/80 hover:text-primary-900">
                            <FiLinkedin className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;