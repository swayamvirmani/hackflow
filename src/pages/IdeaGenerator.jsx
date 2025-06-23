import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PitchGenerator from "../components/PitchGenerator";
import { FiChevronDown, FiChevronUp, FiCheck, FiCopy } from 'react-icons/fi';
import {
    FiCommand, FiCpu, FiClock, FiUsers, FiMessageSquare,
    FiZap, FiAlertTriangle, FiAward, FiClipboard, FiLayers
} from 'react-icons/fi';
import { saveIdea } from '../services/storageService';
import Toast from '../components/Toast';
import { motion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import PromptGenerator from "../components/PromptGenerator"; // add this
import { useFirebase } from '../context/firebase'; // ✅ Add this line

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const IdeaGenerator = () => {
    const { user } = useFirebase();
    const pitchGeneratorRef = useRef(null);
    const [isPitchVisible, setIsPitchVisible] = useState(false);
    const [input, setInput] = useState({
        theme: "",
        techStack: "",
        teamSize: "",
        difficulty: "Beginner",
        duration: "24 Hours"
    });

    const [idea, setIdea] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openSection, setOpenSection] = useState('');
    const [toast, setToast] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        setError("");
    };

    const toggleSection = (sectionId) => {
        setOpenSection(openSection === sectionId ? '' : sectionId);
    };

    const sectionTitles = {
        'overview': 'Project Overview',
        'features': 'Key Features',
        'tech': 'Technical Architecture',
        'timeline': 'Implementation Timeline',
        'innovation': 'Innovation Factors',
        'challenges': 'Potential Challenges',
        'winning': 'Winning Potential',
        'prompt': 'Prompt to Build Entire Project' // ✅ Added Prompt Section Title
    };

    const icons = {
        'overview': <FiClipboard className="w-5 h-5" />,
        'features': <FiLayers className="w-5 h-5" />,
        'tech': <FiCpu className="w-5 h-5" />,
        'timeline': <FiClock className="w-5 h-5" />,
        'innovation': <FiZap className="w-5 h-5" />,
        'challenges': <FiAlertTriangle className="w-5 h-5" />,
        'winning': <FiAward className="w-5 h-5" />,
        'prompt': <FiCommand className="w-5 h-5" />
    };

    const Section = ({ id, content }) => (
        <div className="mb-4">
            <div className="bg-primary-200/10 p-4 rounded-t-lg border border-primary-200/40">
                <div className="flex items-center gap-3">
                    <span className="text-primary-700">{icons[id]}</span>
                    <h3 className="text-xl font-semibold text-primary-700">{sectionTitles[id]}</h3>
                </div>
            </div>
            <button
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between p-4 bg-white/60 border-x border-b border-primary-200/40 hover:bg-primary-200/10 transition-all duration-300"
            >
                <span className="text-primary-700/80">View Details</span>
                {openSection === id ?
                    <FiChevronUp className="w-5 h-5 text-primary-700" /> :
                    <FiChevronDown className="w-5 h-5 text-primary-700" />
                }
            </button>
            {openSection === id && (
                <div className="mt-2 p-4 bg-primary-200/10 border border-primary-200/40 rounded-lg">
                    <div className="prose max-w-none">
                        {id === 'prompt' ? <PromptGenerator idea={idea} /> : (
                            Array.isArray(content) ? (
                                <div className="space-y-2">
                                    {content.map((item, i) => (
                                        <div key={i} className="flex items-start">
                                            <span className="text-primary-700 mr-2">•</span>
                                            <span className="text-primary-900/90">{item.trim().startsWith('-') ? item.substring(1) : item}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-primary-900/90">{content}</p>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    useEffect(() => {
        if (!pitchGeneratorRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsPitchVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(pitchGeneratorRef.current);
        return () => observer.disconnect();
    }, [idea]);

    const generateIdea = async () => {
        if (!input.theme || !input.techStack || !input.teamSize) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError("");
        setIdea("");

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const creativeTwists = [
                "Merge two totally unrelated domains like Fashion + Cybersecurity or Music + Blockchain.",
                "Imagine the project will be judged by aliens. Make it weirdly impressive.",
                "Make it impossible to build unless you break some convention.",
                "Include something only a pirate, a monk, or a time traveler would use.",
                "Make it solve a global issue in an unusual way, like solving water scarcity using NFTs.",
                "The app should interact with nature in some physical or digital way.",
                "Use retro or obsolete tech in a modern way (e.g., Floppy disks + AI).",
                "Use a narrative-driven experience like a quest or story to complete tasks.",
                "Blend AR with non-digital human traditions or folklore.",
                "Design it for people in extreme or rare environments (e.g., underwater cities or Mars)."
            ];

            const twist = creativeTwists[Math.floor(Math.random() * creativeTwists.length)];

            const prompt = `You are an AI idea strategist. Generate a **creative, unique, and never-before-seen** hackathon project idea using the following specifications.

Make it stand out from typical projects like chat apps, weather dashboards, and fitness trackers. Avoid all clichés.

👉 Creative Twist: ${twist}

Theme: ${input.theme}
Tech Stack: ${input.techStack}
Team Size: ${input.teamSize}
Difficulty: ${input.difficulty}
Duration: ${input.duration}

Format your response EXACTLY as follows:

🚀 PROJECT TITLE
[Project Name]

📝 PROJECT OVERVIEW
[Overview text]

🎯 KEY FEATURES
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]

🛠️ TECHNICAL ARCHITECTURE
- Frontend: [Technologies]
- Backend: [Technologies]
- Database: [Choice]
- Additional Tools: [Tools]

⏱️ IMPLEMENTATION TIMELINE
- Hour 1-4: [Tasks]
- Hour 5-12: [Tasks]
- Hour 13-20: [Tasks]
- Hour 21-24: [Tasks]

💡 INNOVATION FACTORS
- [Factor 1]
- [Factor 2]
- [Factor 3]

⚠️ POTENTIAL CHALLENGES
- [Challenge 1]
- [Challenge 2]
- [Challenge 3]

🌟 WINNING POTENTIAL
- [Point 1]
- [Point 2]
- [Point 3]`;

            const result = await model.generateContent({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 1.2,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            });

            const response = await result.response;
            setIdea(response.text());
        } catch (err) {
            console.error("Gemini API Error:", err);
            setError(err.message || "Failed to generate idea. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveIdea = () => {
        try {
            if (!user || !user.uid) {
                setToast({ message: 'User not authenticated', type: 'error' });
                return;
            }
            saveIdea(user.uid, idea);
            setIsSaved(true);
            setToast({ message: 'Idea saved successfully! 🎉', type: 'success' });
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            console.error('Error saving idea:', error);
            setToast({ message: 'Failed to save idea', type: 'error' });
        }
    };
    

    const handleCopyIdea = () => {
        navigator.clipboard.writeText(idea);
        setIsCopied(true);
        setToast({ message: 'Copied to clipboard! 📋', type: 'success' });
        setTimeout(() => setIsCopied(false), 2000);
    };

    const scrollToPitch = () => {
        pitchGeneratorRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen py-12 font-sans bg-gradient-to-br from-primary-50 to-secondary-100">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white/90 border-2 border-primary-200 rounded-xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold text-center mb-8 text-primary-700 cursor-default">
                        Generate Your Hackathon Project
                    </h2>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div className="group">
                            <label className="block text-primary-700 text-sm font-medium mb-2 cursor-default group-hover:translate-x-1 transition-transform duration-300">Theme/Domain*</label>
                            <input
                                type="text"
                                name="theme"
                                value={input.theme}
                                onChange={handleChange}
                                placeholder="e.g., Healthcare, FinTech"
                                className="w-full p-3 bg-white border-2 border-primary-200/40 rounded-lg focus:border-primary-700 text-primary-900 placeholder-primary-700/50 hover:border-primary-700/60 focus:ring-1 focus:ring-primary-700 transition-all duration-300 cursor-text"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-primary-700 text-sm font-medium mb-2 cursor-default group-hover:translate-x-1 transition-transform duration-300">Tech Stack*</label>
                            <input
                                type="text"
                                name="techStack"
                                value={input.techStack}
                                onChange={handleChange}
                                placeholder="e.g., React, Node.js"
                                className="w-full p-3 bg-white border-2 border-primary-200/40 rounded-lg focus:border-primary-700 text-primary-900 placeholder-primary-700/50 hover:border-primary-700/60 focus:ring-1 focus:ring-primary-700 transition-all duration-300 cursor-text"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-primary-700 text-sm font-medium mb-2 cursor-default group-hover:translate-x-1 transition-transform duration-300">Team Size*</label>
                            <input
                                type="number"
                                name="teamSize"
                                value={input.teamSize}
                                onChange={handleChange}
                                placeholder="Number of members"
                                min="1"
                                max="6"
                                className="w-full p-3 bg-white border-2 border-primary-200/40 rounded-lg focus:border-primary-700 text-primary-900 placeholder-primary-700/50 hover:border-primary-700/60 focus:ring-1 focus:ring-primary-700 transition-all duration-300 cursor-pointer"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-primary-700 text-sm font-medium mb-2 cursor-default group-hover:translate-x-1 transition-transform duration-300">Experience Level</label>
                            <select
                                name="difficulty"
                                value={input.difficulty}
                                onChange={handleChange}
                                className="w-full p-3 bg-white border-2 border-primary-200/40 rounded-lg focus:border-primary-700 text-primary-900 cursor-pointer hover:border-primary-700/60 focus:ring-1 focus:ring-primary-700 transition-all duration-300"
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-primary-700 text-sm font-medium mb-2 cursor-default">Hackathon Duration</label>
                            <select
                                name="duration"
                                value={input.duration}
                                onChange={handleChange}
                                className="w-full p-3 bg-white border-2 border-primary-200/40 rounded-lg focus:border-primary-700 text-primary-900 cursor-pointer hover:border-primary-700/60 focus:ring-1 focus:ring-primary-700 transition-all duration-300"
                            >
                                <option>12 Hours</option>
                                <option>24 Hours</option>
                                <option>36 Hours</option>
                                <option>48 Hours</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-700 text-red-700 rounded-lg cursor-default">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <button
                            onClick={generateIdea}
                            disabled={loading}
                            className=" w-full mt-8 py-4 bg-yellow-500 text-white font-bold rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-200/20 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center cursor-wait">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Your Project Idea...
                                </span>
                            ) : "Generate Project Idea "}
                        </button>

                        {idea && !loading && !isPitchVisible && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="fixed bottom-4 right-25 sm:bottom-45 sm:right-30  z-50 px-6 py-4 rounded-lg hover:border-primary-200/40 transition-all duration-300"
                            >
                                <motion.button
                                    onClick={scrollToPitch}
                                    animate={{
                                        y: [0, 10, 0],
                                        opacity: [1, 0.6, 1]
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="flex items-center gap-3 text-primary-700 hover:text-primary-700 group"
                                >
                                    <FiArrowDown className="w-6 h-6 group-hover:scale-110 cursor-pointer transition-transform" />
                                    <span className="cursor-pointer whitespace-nowrap text-lg font-medium">Generate Pitch</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </div>

                    {loading && (
                        <div className="mt-8 text-center cursor-wait">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-700 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                            <p className="mt-2 text-primary-700 cursor-default">Crafting your perfect hackathon idea...</p>
                        </div>
                    )}

                    {idea && !loading && (
                        <>
                            <div className="mt-8">
                                <div className="p-6 bg-white border-2 border-primary-200/40 rounded-lg hover:border-primary-700/60 transition-all duration-300">
                                    <h3 className="text-xl font-semibold mb-6 text-primary-700 cursor-default">Your Generated Project Idea:</h3>
                                    <div className="space-y-4">
                                        {idea.split('\n\n').map((section, index) => {
                                            if (section.startsWith('🚀 PROJECT TITLE')) {
                                                const title = section.split('\n')[1];
                                                return (
                                                    <div key="title" className="bg-primary-200/10 p-4 rounded-lg border border-primary-200/40">
                                                        <h2 className="text-2xl font-bold text-primary-700">{title}</h2>
                                                    </div>
                                                );
                                            }

                                            const sections = {
                                                'overview': '📝 PROJECT OVERVIEW',
                                                'features': '🎯 KEY FEATURES',
                                                'tech': '🛠️ TECHNICAL ARCHITECTURE',
                                                'timeline': '⏱️ IMPLEMENTATION TIMELINE',
                                                'innovation': '💡 INNOVATION FACTORS',
                                                'challenges': '⚠️ POTENTIAL CHALLENGES',
                                                'winning': '🌟 WINNING POTENTIAL',
                                                'prompt': 'Prompt to Build Entire Project'
                                            };

                                            for (const [key, header] of Object.entries(sections)) {
                                                if (section.includes(header)) {
                                                    const [_, ...content] = section.split('\n');
                                                    return (
                                                        <Section
                                                            key={key}
                                                            id={key}
                                                            content={content}
                                                        />
                                                    );
                                                }
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button
                                            onClick={handleSaveIdea}
                                            className={`px-4 py-2 text-sm border rounded-lg transition-all duration-300 cursor-pointer ${isSaved
                                                    ? 'bg-primary-700 text-white border-transparent'
                                                    : 'text-primary-700 border-primary-700 hover:bg-primary-200/10'
                                                }`}
                                        >
                                            {isSaved ? '✓ Saved' : 'Save Idea'}
                                        </button>
                                        <button
                                            onClick={handleCopyIdea}
                                            className="px-4 py-2 text-sm text-primary-700 border border-primary-700 rounded-lg hover:bg-primary-200/10 transition-all duration-300 cursor-pointer flex items-center gap-2"
                                        >
                                            {isCopied ? (
                                                <>
                                                    <FiCheck className="w-4 h-4" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiCopy className="w-4 h-4" />
                                                    <span>Copy Idea</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {idea && !loading && (
                                <>
                                    <PromptGenerator idea={idea} />
                                    <div ref={pitchGeneratorRef}>
                                        <PitchGenerator idea={idea} />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IdeaGenerator;
