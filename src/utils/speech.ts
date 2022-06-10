/**
 * Tells browser to speak out loud given sentence in given language in given volume
 * @param text
 * @param language
 * @param volume
 */
export function speak(text: DualLanguageValue, language: Language, volume: number): void {
  const utterance = new SpeechSynthesisUtterance(text[language]);
  utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';
  utterance.volume = volume;
  window.speechSynthesis.speak(utterance);
}
