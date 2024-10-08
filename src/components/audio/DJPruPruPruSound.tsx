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

  // Updated volume
  useEffect(() => {
    controls.volume(volume);
  }, [volume]); // eslint-disable-line

  return <>{audio}</>;
}
