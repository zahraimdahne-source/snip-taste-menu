// Voice Recognition for Darija/French/Arabic
// Uses Web Speech API with custom Darija handling

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  language: 'darija' | 'fr' | 'ar' | 'en';
}

// Darija word mappings (spoken -> written)
const DARIJA_MAPPINGS: Record<string, string> = {
  // Food items
  بيتزا: 'pizza',
  طاكوس: 'tacos',
  برݣر: 'burger',
  برجر: 'burger',
  سلاطة: 'salade',
  معكرونة: 'pates',
  كباب: 'kabab',
  عصير: 'jus',

  // Common Darija words
  بغيت: 'bghit',
  بغيتي: 'bghiti',
  واحد: 'wahd',
  جوج: 'jouj',
  تلاتة: 'tlata',
  ربعة: 'reb3a',
  خمسة: 'khamsa',

  // Sizes
  صغير: 'sghir',
  صغيرة: 'sghira',
  كبير: 'kbir',
  كبيرة: 'kbira',

  // Actions
  زيد: 'zid',
  حذف: 'hdef',
  سيفط: 'sift',
  واصل: 'wassel',

  // Yes/No
  إييه: 'iyyeh',
  آه: 'ah',
  نعم: 'iyyeh',
  لا: 'la',
  بلا: 'bla',
};

// Detect language from transcript
function detectLanguage(text: string): 'darija' | 'fr' | 'ar' | 'en' {
  const arabicChars = /[\u0600-\u06FF]/;
  const frenchWords = /\b(je|tu|il|elle|nous|vous|bonjour|merci|pizza|tacos)\b/i;
  const darijaWords = /\b(bghit|salam|merhba|chno|wach|kayn|3andna)\b/i;

  if (arabicChars.test(text)) return 'ar';
  if (darijaWords.test(text)) return 'darija';
  if (frenchWords.test(text)) return 'fr';
  return 'en';
}

// Normalize Darija text
function normalizeDarija(text: string): string {
  let normalized = text.toLowerCase();

  // Replace Arabic words with Darija equivalents
  Object.entries(DARIJA_MAPPINGS).forEach(([arabic, darija]) => {
    normalized = normalized.replace(new RegExp(arabic, 'g'), darija);
  });

  // Common Darija number conversions
  normalized = normalized
    .replace(/\b(wahd|واحد)\b/g, '1')
    .replace(/\b(jouj|جوج)\b/g, '2')
    .replace(/\b(tlata|تلاتة)\b/g, '3')
    .replace(/\b(reb3a|ربعة)\b/g, '4')
    .replace(/\b(khamsa|خمسة)\b/g, '5');

  return normalized.trim();
}

// Main voice recognition class
export class VoiceRecognition {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();

      // Configure for multi-language support
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  async startListening(
    language: 'ar-MA' | 'fr-FR' | 'en-US' = 'ar-MA'
  ): Promise<VoiceRecognitionResult> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      throw new Error('Already listening');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject(new Error('No recognition'));

      // Set language (ar-MA for Moroccan Arabic/Darija)
      this.recognition.lang = language;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        this.isListening = false;

        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        // Detect and normalize
        const detectedLang = detectLanguage(transcript);
        const normalizedText =
          detectedLang === 'darija' || detectedLang === 'ar'
            ? normalizeDarija(transcript)
            : transcript;

        resolve({
          transcript: normalizedText,
          confidence,
          language: detectedLang,
        });
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// Singleton instance
let voiceRecognitionInstance: VoiceRecognition | null = null;

export function getVoiceRecognition(): VoiceRecognition {
  if (!voiceRecognitionInstance) {
    voiceRecognitionInstance = new VoiceRecognition();
  }
  return voiceRecognitionInstance;
}
