export function speak(text: DualLanguageValue, language: Language) {
  const utterance = new SpeechSynthesisUtterance(text[language]);
  utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';

  window.speechSynthesis.speak(utterance);
}
