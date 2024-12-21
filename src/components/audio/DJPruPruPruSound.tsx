import { useEffect } from 'react';
import { useAudio } from 'react-use';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Sound
const airHorn = require('assets/sounds/airhorn.mp3');

export function DJPruPruPruSound() {
  const [volume] = useGlobalLocalStorage('volume');
  const [audio, , controls] = useAudio({
    src: airHorn,
    autoPlay: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: it only needs to be retriggered when the volume changes
  useEffect(() => {
    controls.volume(volume);
  }, [volume]);

  return <>{audio}</>;
}
