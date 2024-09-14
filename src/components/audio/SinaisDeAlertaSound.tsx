import { useEffect } from 'react';
import { useAudio } from 'react-use';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Sound
const sinaisDeAlertaTimer = require('assets/sounds/sinais-de-alerta-30.mp3');

export function SinaisDeAlertaTimerSound() {
  const [volume] = useGlobalLocalStorage('volume');
  const [audio, , controls] = useAudio({
    src: sinaisDeAlertaTimer,
    autoPlay: true,
    loop: false,
  });

  // Updated volume
  useEffect(() => {
    controls.volume(volume);
  }, [volume]); // eslint-disable-line

  return <>{audio}</>;
}
