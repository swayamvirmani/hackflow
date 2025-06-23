import React, { useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';

const PromptGenerator = ({ idea }) => {
    const [copied, setCopied] = useState(false);

    const buildPrompt = () => {
        return `You are a senior full-stack developer. Based on the following project idea, build the exact same application with all key features, tech stack, and implementation details:

${idea}

Generate:
- File structure
- Components and code for frontend/backend
- API routes if needed
- Database schema
- Proper comments

The output should be accurate enough to recreate the project completely.`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(buildPrompt());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-8 font-sans">
            <div className="p-6 bg-white border-2 border-primary-200/40 rounded-lg hover:border-primary-700/60 hover:shadow-[0_0_15px_#ffb84d] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-primary-700 cursor-default">
                        🧠 Build Prompt for GPT
                    </h3>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-primary-700 border cursor-pointer border-primary-700 rounded-lg hover:bg-primary-200/10 transition-all duration-300"
                    >
                        {copied ? (
                            <>
                                <FiCheck className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <FiCopy className="w-4 h-4" />
                                Copy Prompt
                            </>
                        )}
                    </button>
                </div>
                <div className="bg-primary-200/10 p-4 rounded-lg border border-primary-200/40 text-primary-900 text-sm whitespace-pre-wrap">
                    {buildPrompt()}
                </div>
            </div>
        </div>
    );
};

export default PromptGenerator;
