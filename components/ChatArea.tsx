import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, HelpCircle } from 'lucide-react';
import Button from './Button';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onAction: (action: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, onAction }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom only if new message appears
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Find the last quiz to display as a Modal, if it's the latest message
  const lastMessage = messages[messages.length - 1];
  const activeQuiz = lastMessage?.quiz;

  return (
    <>
      {/* GAME CHAT BOX (Bottom Left Overlay) */}
      <div className="absolute bottom-20 left-4 w-full max-w-[350px] md:max-w-[400px] h-[300px] z-20 pointer-events-auto flex flex-col gap-2">
        <div className="glass-panel rounded-xl p-3 h-full overflow-y-auto scrollbar-hide flex flex-col shadow-2xl">
          {messages.length === 0 && (
            <div className="text-white/50 text-center mt-10 font-bold">
              Menghubungkan ke Server...
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className="mb-3 animate-in slide-in-from-left-2 duration-300">
              <span className={`font-black text-shadow mr-2 ${msg.role === 'user' ? 'text-yellow-400' : 'text-blue-400'}`}>
                [{msg.role === 'user' ? 'Rafi' : 'GM'}]:
              </span>
              <span className="text-white font-semibold text-shadow-sm leading-snug">
                {/* Clean text from quiz/image parsing artifacts if any */}
                {msg.text}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="text-blue-300 italic animate-pulse text-sm font-bold">
              Sedang mengetik...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* QUIZ MODAL (Center Screen Popup) */}
      {activeQuiz && !isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border-b-8 border-slate-200 shadow-2xl scale-100">
            <div className="flex justify-center -mt-12 mb-4">
              <div className="bg-yellow-400 p-4 rounded-full border-4 border-white shadow-lg">
                <HelpCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-center text-2xl font-black text-slate-800 mb-6 uppercase tracking-wider">
              Tantangan!
            </h3>
            
            <p className="text-center text-slate-600 font-bold text-lg mb-8">
              {activeQuiz.question}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {activeQuiz.options.map((option, idx) => (
                <Button 
                  key={idx}
                  variant="primary"
                  fullWidth
                  onClick={() => onAction(option)}
                  className="py-4 text-lg"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;