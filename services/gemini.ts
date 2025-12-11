import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { ParsedResponse, GameState, QuizData } from '../types';

let chatSession: Chat | null = null;
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const startNewGame = async (): Promise<ParsedResponse> => {
  try {
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const result: GenerateContentResponse = await chatSession.sendMessage({ message: "Mulai" });
    const text = result.text || "";
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Failed to start game:", error);
    return {
      text: "Maaf, terjadi kesalahan saat menghubungi menara waktu. Coba muat ulang halaman. (Error: API Connection)",
    };
  }
};

export const sendGameMessage = async (message: string): Promise<ParsedResponse> => {
  if (!chatSession) {
    return startNewGame();
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({ message });
    const text = result.text || "";
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Failed to send message:", error);
    return {
      text: "Koneksi terputus sejenak... silakan coba lagi.",
    };
  }
};

export const generateSceneImage = async (prompt: string): Promise<string | null> => {
  try {
    // Inject style modifiers for Roblox-like/3D Game feel
    const styledPrompt = `${prompt}, 3d render style, vibrant colors, video game screenshot, isometric or wide angle view, blocky playful style, high quality render`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: styledPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '16:9'
        }
      }
    });

    // Iterate parts to find inlineData
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.warn("Image generation skipped/failed", error);
    return null;
  }
};

const parseGeminiResponse = (responseText: string): ParsedResponse => {
  // Regex to extract the JSON block at the end
  const jsonRegex = new RegExp('```json\\s*([\\s\\S]*?)\\s*```');
  const match = responseText.match(jsonRegex);

  let gameStateUpdate: Partial<GameState> | undefined = undefined;
  let quizData: QuizData | undefined = undefined;
  let cleanText = responseText;

  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      
      // Separate quiz data from generic game state
      if (parsed.quiz) {
        quizData = parsed.quiz;
        delete parsed.quiz; // Remove from game state update
      }

      gameStateUpdate = parsed;
      // Remove the JSON block from the display text
      cleanText = responseText.replace(match[0], '').trim();
    } catch (e) {
      console.warn("Failed to parse game state JSON from response", e);
    }
  }

  // CLEANUP: Remove Markdown symbols (*, **, #, _) to prevent TTS from reading "Asterisk"
  // and to ensure the UI looks clean since we aren't using a Markdown renderer.
  cleanText = cleanText
    .replace(/\*\*/g, '')   // Remove bold markers
    .replace(/\*/g, '')     // Remove italic/bullet markers
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/`/g, '')      // Remove code ticks
    .replace(/_/g, '')      // Remove underscores
    .trim();

  return {
    text: cleanText,
    gameStateUpdate,
    quiz: quizData
  };
};