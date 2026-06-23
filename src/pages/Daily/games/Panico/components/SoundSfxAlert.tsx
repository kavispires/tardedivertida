import { useEffect } from 'react';
// Ant Design Resources
import { Alert } from 'antd';
// Hooks
import { useGlobalLocalStorage } from '@hooks/useGlobalLocalStorage';
// Components
import { Translate } from '@components/language/Translate';
// Pages
import { Region } from '@pages/Daily/components/Region';
import { SoundFXToggle } from '@pages/Daily/components/SoundFXToggle';
// Internal
import { buttonCountdownSfx } from '../utils/soundEffect';

export function SoundSfxAlert() {
  const [volume] = useGlobalLocalStorage('volume');

  useEffect(() => {
    buttonCountdownSfx.volume(volume > 0 ? 0.2 : 0);
  }, [volume]);

  return (
    <Region>
      <Alert
        type="warning"
        showIcon
        title={
          <Translate
            en="This game works better with sound on."
            pt="Este jogo é melhor com o som ligado."
          />
        }
        className="transparent"
        style={{ color: 'gold' }}
        action={<SoundFXToggle className="ml-4" />}
      />
    </Region>
  );
}
