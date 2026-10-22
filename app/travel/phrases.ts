export type PhrasePack = {
  language: string;
  lang: string;
  phrases: [string, string][];
  source: string;
};
const pack = (
  language: string,
  lang: string,
  phrases: [string, string][],
  slug: string,
): PhrasePack => ({
  language,
  lang,
  phrases,
  source: `https://en.wikivoyage.org/wiki/${slug}_phrasebook`,
});
export const phrasePacks: PhrasePack[] = [
  pack(
    "English",
    "en-GB",
    [
      ["Hello", "Hello"],
      ["Thank you", "Thank you"],
      ["Please", "Please"],
      ["Excuse me", "Excuse me"],
    ],
    "English",
  ),
  pack(
    "French",
    "fr-FR",
    [
      ["Hello", "Bonjour"],
      ["Thank you", "Merci"],
      ["Please", "S’il vous plaît"],
      ["Excuse me", "Excusez-moi"],
    ],
    "French",
  ),
  pack(
    "Spanish",
    "es-ES",
    [
      ["Hello", "Hola"],
      ["Thank you", "Gracias"],
      ["Please", "Por favor"],
      ["Excuse me", "Disculpe"],
    ],
    "Spanish",
  ),
  pack(
    "Portuguese",
    "pt-BR",
    [
      ["Hello", "Olá"],
      ["Thank you (male speaker)", "Obrigado"],
      ["Please", "Por favor"],
      ["Excuse me", "Com licença"],
    ],
    "Portuguese",
  ),
  pack(
    "Arabic",
    "ar",
    [
      ["Hello", "مرحبا"],
      ["Thank you", "شكرا"],
      ["Please", "من فضلك"],
      ["Peace be upon you", "السلام عليكم"],
    ],
    "Arabic",
  ),
  pack(
    "Japanese",
    "ja-JP",
    [
      ["Hello", "こんにちは"],
      ["Thank you", "ありがとうございます"],
      ["Excuse me", "すみません"],
      ["Good morning", "おはようございます"],
    ],
    "Japanese",
  ),
  pack(
    "German",
    "de-DE",
    [
      ["Hello", "Hallo"],
      ["Thank you", "Danke"],
      ["Please", "Bitte"],
      ["Excuse me", "Entschuldigung"],
    ],
    "German",
  ),
  pack(
    "Italian",
    "it-IT",
    [
      ["Hello", "Ciao"],
      ["Thank you", "Grazie"],
      ["Please", "Per favore"],
      ["Excuse me", "Mi scusi"],
    ],
    "Italian",
  ),
  pack(
    "Swahili",
    "sw-KE",
    [
      ["Hello", "Hujambo"],
      ["Thank you", "Asante"],
      ["Please", "Tafadhali"],
      ["Welcome", "Karibu"],
    ],
    "Swahili",
  ),
  pack(
    "Hindi",
    "hi-IN",
    [
      ["Hello", "नमस्ते"],
      ["Thank you", "धन्यवाद"],
      ["Please", "कृपया"],
      ["Excuse me", "माफ़ कीजिए"],
    ],
    "Hindi",
  ),
  pack(
    "Chinese",
    "zh-CN",
    [
      ["Hello", "你好"],
      ["Thank you", "谢谢"],
      ["Please", "请"],
      ["Excuse me", "对不起"],
    ],
    "Mandarin",
  ),
  pack(
    "Korean",
    "ko-KR",
    [
      ["Hello", "안녕하세요"],
      ["Thank you", "감사합니다"],
      ["Excuse me", "실례합니다"],
      ["Yes", "네"],
    ],
    "Korean",
  ),
  pack(
    "Turkish",
    "tr-TR",
    [
      ["Hello", "Merhaba"],
      ["Thank you", "Teşekkür ederim"],
      ["Please", "Lütfen"],
      ["Excuse me", "Affedersiniz"],
    ],
    "Turkish",
  ),
];
