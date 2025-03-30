import arteRuimTimer from 'assets/sounds/arte-ruim-timer.mp3';
import { useEffect } from 'react';
import { useAudio } from 'react-use';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Sound

export function ArteRuimTimerSound() {
  const [volume] = useGlobalLocalStorage('volume');
  const [audio, , controls] = useAudio({
    src: arteRuimTimer,
    autoPlay: true,
    loop: false,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: it only needs to be retriggered when the volume changes
  useEffect(() => {
    controls.volume(volume);
  }, [volume]);

  return <>{audio}</>;
}
