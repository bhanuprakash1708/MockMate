import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface GenerateSentencesOptions {
  count: number;
  difficulty: 'medium' | 'hard' | 'expert';
}

export const generatePronunciationSentences = async (options: GenerateSentencesOptions): Promise<string[]> => {
  try {
    const { count, difficulty } = options;

    if (!count || count < 1 || count > 20) {
      throw new Error('Invalid sentence count. Must be between 1 and 20.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const difficultyPrompts = {
      medium: 'moderately challenging words with some complex consonant clusters and common pronunciation difficulties',
      hard: 'difficult words with complex pronunciation, silent letters, unusual phonetic patterns, and challenging consonant combinations',
      expert: 'extremely difficult words with complex phonetic structures, multiple silent letters, rare pronunciation patterns, and tongue-twisters'
    };

    const prompt = `Generate exactly ${count} English sentences for pronunciation practice. Each sentence should contain ${difficultyPrompts[difficulty]}.

Requirements for ${difficulty} difficulty:
- Each sentence should be 8-15 words long
- Include words that are challenging to pronounce for English learners
- Make sentences meaningful and contextually appropriate
- Vary the sentence structures and topics
- Include a mix of different challenging pronunciation elements

Examples of challenging words to include based on difficulty:

MEDIUM:
- Words with th sounds (think, through, weather)
- R and L combinations (world, girl, probably)  
- Silent letters (know, write, psychology)
- Stressed syllables (photograph, photography, photographer)

HARD:
- Complex consonant clusters (strengths, sixths, twelfths)
- Words commonly mispronounced (nuclear, especially, supposedly, comfortable)
- Unusual phonetic patterns (rhythm, onomatopoeia, worcestershire)
- Challenging vowel sounds (entrepreneurship, pronunciation, miscellaneous)

EXPERT:
- Tongue twisters elements (she sells seashells)
- Medical/scientific terms (pharmaceutical, anesthesiologist, otolaryngologist)
- Complex compound words (antidisestablishmentarianism, pseudopseudohypoparathyroidism)
- Multiple challenging sounds in one sentence

Please return only the sentences, one per line, without numbering, quotation marks, or additional formatting. Make sure each sentence flows naturally and makes sense.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the sentences from the response
    const sentences = text
      .split('\n')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0 && !sentence.match(/^\d+\./) && sentence.length > 10)
      .slice(0, count); // Ensure we don't exceed the requested count

    if (sentences.length === 0) {
      throw new Error('No valid sentences generated');
    }

    // If we didn't get enough sentences, pad with fallback sentences
    const fallbackSentences = {
      medium: [
        "The thoughtful photographer captured beautiful weather throughout the world.",
        "Psychology students frequently study the rhythm of human behavior patterns.",
        "Knowledge of pronunciation helps people communicate more effectively in professional settings."
      ],
      hard: [
        "The anesthesiologist carefully administered medication to ensure patient comfort.",
        "Worcestershire sauce supposedly enhances the flavor of many culinary preparations.",
        "Entrepreneurs often face miscellaneous challenges when developing pharmaceutical products."
      ],
      expert: [
        "The otolaryngologist's pseudopseudohypoparathyroidism diagnosis required extensive pharmaceutical intervention.",
        "Antidisestablishmentarianism represents an extraordinarily complex philosophical and political perspective.",
        "The anesthesiologist's pharmaceutical knowledge of otolaryngological procedures proved absolutely indispensable."
      ]
    };

    while (sentences.length < count && fallbackSentences[difficulty].length > 0) {
      const fallback = fallbackSentences[difficulty].shift();
      if (fallback && !sentences.includes(fallback)) {
        sentences.push(fallback);
      }
    }

    return sentences.slice(0, count);
  } catch (error) {
    console.error('Error generating sentences:', error);
    
    // Return fallback sentences if API fails
    const fallbackSentences = [
      "The quick brown fox jumps over the lazy dog with extraordinary enthusiasm.",
      "Pronunciation practice helps people improve their speaking skills significantly.",
      "Technology and innovation drive modern society toward unprecedented achievements.",
      "Beautiful butterflies flutter through blooming gardens during springtime weather.",
      "Students should practice pronunciation exercises regularly to enhance communication skills."
    ];
    
    return fallbackSentences.slice(0, Math.min(options.count, fallbackSentences.length));
  }
};
