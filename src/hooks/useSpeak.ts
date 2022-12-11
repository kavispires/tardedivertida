import { useEffectOnce } from 'react-use';
import { speak } from 'utils/speech';
import { useGlobalState } from './useGlobalState';
import { useLanguage } from './useLanguage';

export function useSpeak(text: DualLanguageValue, onEnd?: GenericFunction) {
  const { language } = useLanguage();
  const [volume] = useGlobalState('volume');

  useEffectOnce(() => {
    speak(text, language, volume, onEnd);
  });
}
