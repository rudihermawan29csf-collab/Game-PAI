export interface GameState {
  location: string;
  score: number;
  sheets: number;
  visual_description?: string;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface QuizData {
  question: string;
  options: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 image string
  quiz?: QuizData;
  timestamp: number;
}

export interface ParsedResponse {
  text: string;
  gameStateUpdate?: Partial<GameState>;
  quiz?: QuizData;
}

export enum GameAction {
  START = "Mulai",
  NORTH = "Pergi ke Utara",
  SOUTH = "Pergi ke Selatan",
  EAST = "Pergi ke Timur",
  WEST = "Pergi ke Barat",
  LOOK = "Lihat sekitar",
  TALK = "Berbicara dengan penduduk",
  INVENTORY = "Buka inventaris",
  MAP = "Cek peta",
}