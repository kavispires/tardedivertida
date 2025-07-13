import { useEffect } from 'react';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { speak } from 'utils/speech';

type SpeakProps = {
  text: DualLanguageValue;
};

export function Speak({ text }: SpeakProps) {
  const [volume] = useGlobalLocalStorage('volume');
  const { language } = useLanguage();

  // Updated volume
  // biome-ignore lint/correctness/useExhaustiveDependencies: it only needs to be retriggered when the volume changes
  useEffect(() => {
    speak(text, language, volume);
  }, [volume]);

  return null;
}
