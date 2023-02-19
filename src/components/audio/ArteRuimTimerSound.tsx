import { useGlobalState } from 'hooks/useGlobalState';
import { useEffect } from 'react';
import { useAudio } from 'react-use';
// Sound
const arteRuimTimer = require('assets/sounds/arte-ruim-timer.mp3');

export function ArteRuimTimerSound() {
  const [volume] = useGlobalState('volume');
  const [audio, , controls] = useAudio({
    src: arteRuimTimer,
    autoPlay: true,
    loop: false,
  });

  // Updated volume
  useEffect(() => {
    controls.volume(volume);
  }, [volume]); // eslint-disable-line

  return <>{audio}</>;
}
