import { useState } from 'react';
import { FiMessageCircle, FiX, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';

const SUGGESTIONS = [
  'How do I connect my Instagram account?',
  'What does the dashboard show?',
  'How do I add another social account?',
  'How do I export my analytics?'
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I am your SocialSync Assistant. How can I help you get started?' }
  ]);
  const { isDarkMode } = useTheme();

  const handleSuggestion = (text) => {
    setMessages((msgs) => [...msgs, { from: 'user', text }, { from: 'ai', text: getAIResponse(text) }]);
  };

  // Simple static responses for demo
  function getAIResponse(text) {
    if (text.toLowerCase().includes('instagram')) return 'To connect Instagram, click the Instagram card and follow the instructions.';
    if (text.toLowerCase().includes('dashboard')) return 'The dashboard shows your analytics, insights, and recommendations for all connected accounts.';
    if (text.toLowerCase().includes('add')) return 'Click the "+" or "Connect" button on any platform card to add another account.';
    if (text.toLowerCase().includes('export')) return 'Use the Export button at the top right of your dashboard to download your analytics.';
    return 'I can help you connect accounts, navigate features, or answer questions about SocialSync!';
  }

  return (
    <div>
      {/* Floating Button */}
      <button
        className={`fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none transition-opacity duration-200 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
      >
        <FiMessageCircle className="w-7 h-7" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-6 right-6 z-50 w-[370px] h-[520px] max-w-full flex flex-col rounded-2xl shadow-2xl border transition-colors duration-200
              ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-indigo-200'}`}
          >
            <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors duration-200
              ${isDarkMode ? 'border-gray-800' : 'border-indigo-100'}`}>
              <div className={`flex items-center gap-2 font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                <FiZap className="w-5 h-5" /> AI Assistant
              </div>
              <button onClick={() => setOpen(false)} className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-indigo-300' : 'text-gray-400 hover:text-indigo-500'}`}>
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 380 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`px-3 py-2 rounded-xl text-sm max-w-[80%] transition-colors duration-200
                    ${msg.from === 'ai'
                      ? (isDarkMode ? 'bg-gray-800 text-indigo-100' : 'bg-indigo-50 text-indigo-900')
                      : 'bg-indigo-600 text-white'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                      ${isDarkMode
                        ? 'bg-gray-800 text-indigo-200 hover:bg-gray-700'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                    onClick={() => handleSuggestion(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
