import { FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-[#01FF00]/20">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold text-[#01FF00]">HackFlow</span>
                        <p className="mt-2 text-white/60">
                            AI-powered hackathon idea generator
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a href="https://github.com/swayamvirmani" target="_blank" rel="noopener noreferrer" 
                            className="text-[#01FF00]/80 hover:text-[#01FF00]">
                            <FiGithub className="w-6 h-6" />
                        </a>
                        <a href="https://github.com/swayamvirmani" target="_blank" rel="noopener noreferrer" 
                            className="text-[#01FF00]/80 hover:text-[#01FF00]">
                            <FiLinkedin className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;