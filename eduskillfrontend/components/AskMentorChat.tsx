'use client';

import { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Botpress iframe URLs per course ID
const BOT_IFRAMES: Record<number, string> = {
  1: 'https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/02/16/20250202160648-VCUOL1UL.json',
  2: 'https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/09/08/20250209083535-NK1R4RHP.json',
  3: 'https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/09/08/20250209082332-6TPD5XH2.json',
  4: 'https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/04/10/19/20260410191552-D8VP7A3R.json',
};

const BOT_NAMES: Record<number, string> = {
  1: 'Web Dev Mentor',
  2: 'App Dev Mentor',
  3: 'Data Science Mentor',
  4: 'ML Mentor',
};

interface AskMentorChatProps {
  courseId: number;
}

export default function AskMentorChat({ courseId }: AskMentorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const iframeUrl = BOT_IFRAMES[courseId];
  const botName = BOT_NAMES[courseId] || 'AI Mentor';

  if (!iframeUrl) return null;

  return (
    <>
      {/* Floating "Ask the Mentor" Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-black text-white rounded-full shadow-2xl hover:bg-gray-900 transition-colors group"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <MessageCircle size={18} />
        </div>
        <span className="font-bold text-sm tracking-tight">Ask the Mentor</span>
        <Sparkles size={14} className="text-white/40" />
      </motion.button>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[95vw] h-[85vh] bg-white rounded-[32px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 32px 64px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.1)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 bg-black text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight">{botName}</h3>
                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase">AI Mentor • Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Iframe */}
              <iframe
                src={iframeUrl}
                title={botName}
                className="w-full border-0"
                style={{ height: 'calc(85vh - 76px)' }}
                allow="microphone; camera"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
