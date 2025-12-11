
// Audio Assets (Using free assets from Mixkit/Standard sources)
const SFX_URLS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Pop click
    correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success chime
    wrong: 'https://assets.mixkit.co/active_storage/sfx/2034/2034-preview.mp3', // Failure tone
    start: 'https://assets.mixkit.co/active_storage/sfx/1126/1126-preview.mp3', // Sci-fi warp/start
};

class AudioService {
    private isMuted: boolean = false;
    private synthesis: SpeechSynthesis;

    constructor() {
        this.synthesis = window.speechSynthesis;
    }

    // --- SYSTEM CONTROLS ---
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.synthesis.cancel();
        }
        return this.isMuted;
    }

    getMuteState() {
        return this.isMuted;
    }

    // --- SFX ---
    playSfx(type: 'click' | 'correct' | 'wrong' | 'start') {
        if (this.isMuted) return;
        const audio = new Audio(SFX_URLS[type]);
        audio.volume = 0.5;
        audio.play().catch(e => console.warn("Audio play failed (interaction needed)", e));
    }

    // --- TTS (TEXT TO SPEECH) - PERCAKAPAN SAJA ---
    speak(text: string) {
        if (this.isMuted) return;

        // Cancel previous speech to prevent overlap
        this.synthesis.cancel();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; // Force Indonesian
        utterance.pitch = 1.0;
        utterance.rate = 1.0; // Normal speed for storytelling
        
        // Select Voice (Strictly prefer Indonesian)
        const voices = this.synthesis.getVoices();
        
        // Try to find a specific Google Indonesian voice or any ID voice
        const indonesianVoice = voices.find(v => v.lang === 'id-ID' || v.lang.includes('Indonesia'));
        
        if (indonesianVoice) {
            utterance.voice = indonesianVoice;
        }

        this.synthesis.speak(utterance);
    }
}

export const audioManager = new AudioService();
