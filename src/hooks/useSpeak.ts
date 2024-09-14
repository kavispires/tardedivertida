import { useEffectOnce } from 'react-use';
// Utils
import { speak } from 'utils/speech';
// Internal
import { useGlobalLocalStorage } from './useGlobalLocalStorage';
import { useLanguage } from './useLanguage';

export function useSpeak(text: DualLanguageValue, onEnd?: GenericFunction) {
  const { language } = useLanguage();
  const [volume] = useGlobalLocalStorage('volume');

  useEffectOnce(() => {
    speak(text, language, volume, onEnd);
  });
}
