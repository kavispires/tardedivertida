import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useEffect } from 'react';
import { speak } from 'utils/speech';

type SpeakProps = {
  text: DualLanguageValue;
};

export function Speak({ text }: SpeakProps) {
  const [volume] = useGlobalState('volume');
  const { language } = useLanguage();

  // Updated volume
  useEffect(() => {
    speak(text, language, volume);
  }, [volume]); // eslint-disable-line

  return <></>;
}
