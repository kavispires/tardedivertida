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
  useEffect(() => {
    speak(text, language, volume);
  }, [volume]); // eslint-disable-line

  return <></>;
}
