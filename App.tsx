
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, ChatMessage } from './types';
import { INITIAL_GAME_STATE } from './constants';
import { startNewGame, sendGameMessage, generateSceneImage } from './services/gemini';
import { audioManager } from './services/audio'; // Import Audio Manager
import Dashboard from './components/Dashboard';
import ChatArea from './components/ChatArea';
import Controls from './components/Controls';
import Button from './components/Button';
import { Gamepad2 } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // Default stylish placeholder for start screen
  const [bgImage, setBgImage] = useState<string>('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1920&auto=format&fit=crop');

  const processResponse = async (text: string, stateUpdate: Partial<GameState> | undefined, quizData: any) => {
    let finalGameState = { ...gameState };
    
    // Play SFX based on quiz result (simple heuristic based on score change or text)
    if (text.toLowerCase().includes("benar") || text.toLowerCase().includes("tepat")) {
        audioManager.playSfx('correct');
    } else if (text.toLowerCase().includes("salah") || text.toLowerCase().includes("kurang tepat")) {
        audioManager.playSfx('wrong');
    }

    // 1. Update text immediately
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'model',
      text: text,
      timestamp: Date.now(),
      quiz: quizData,
    };

    setMessages((prev) => [...prev, aiMsg]);
    
    // Trigger TTS for the new message (Percakapan/Narasi)
    audioManager.speak(text);

    // 2. Update basic game state
    if (stateUpdate) {
      finalGameState = { ...finalGameState, ...stateUpdate };
      setGameState(finalGameState);
    }
    
    // 3. Handle Visualization (Async)
    if (stateUpdate?.visual_description) {
      generateSceneImage(stateUpdate.visual_description).then((base64Image) => {
        if (base64Image) {
          setBgImage(base64Image);
        }
      });
    }

    setGameState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleAction = useCallback(async (actionText: string) => {
    if (!actionText.trim()) return;

    // SFX
    audioManager.playSfx('click');

    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: actionText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setGameState((prev) => ({ ...prev, isLoading: true }));

    // Call API
    const response = await sendGameMessage(actionText);

    await processResponse(response.text, response.gameStateUpdate, response.quiz);
  }, [gameState]);

  const initGame = useCallback(async () => {
    // SFX
    audioManager.playSfx('start');
    
    setHasStarted(true);
    setGameState((prev) => ({ ...prev, isPlaying: true, isLoading: true }));
    
    const response = await startNewGame();
    
    await processResponse(response.text, response.gameStateUpdate, response.quiz);
  }, []);

  const toggleMute = () => {
      const newState = audioManager.toggleMute();
      setIsMuted(newState);
  };

  // START SCREEN (Lobby)
  if (!hasStarted) {
    return (
      <div className="h-screen w-screen relative overflow-hidden bg-blue-500 flex items-center justify-center font-sans">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
           {/* Logo / Game Title */}
           <div className="bg-white p-6 rounded-3xl shadow-[0_10px_0_rgb(0,0,0,0.1)] mb-8 transform hover:scale-105 transition-transform border-4 border-white/50">
               <Gamepad2 className="w-20 h-20 text-blue-500 mx-auto mb-2" />
               <h1 className="text-5xl md:text-7xl font-black text-blue-500 tracking-tighter text-center uppercase drop-shadow-sm">
                 Jejak<br/>Umayyah
               </h1>
               <div className="bg-yellow-400 text-yellow-900 font-bold text-center px-4 py-1 rounded-full mt-2 transform -rotate-2 inline-block shadow-sm">
                 Adventure RPG
               </div>
           </div>

           <Button 
            onClick={initGame} 
            className="text-2xl px-12 py-6 bg-green-500 hover:bg-green-400 border-green-600 border-b-[8px] active:border-b-0 active:translate-y-2 shadow-2xl"
           >
             MULAI GAME ▶
           </Button>
        </div>
      </div>
    );
  }

  // MAIN GAME SCREEN (HUD Interface)
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-sans select-none">
      
      {/* 1. THE WORLD (Background) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        {/* Vignette Overlay for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
      </div>

      {/* 2. HUD LAYERS */}
      <Dashboard state={gameState} />
      
      {/* 3. CHAT & INTERACTION LAYERS */}
      <ChatArea 
        messages={messages} 
        isLoading={gameState.isLoading} 
        onAction={handleAction}
      />
      
      {/* 4. CONTROLS LAYER */}
      <Controls 
        onAction={handleAction} 
        isLoading={gameState.isLoading} 
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

    </div>
  );
};

export default App;
