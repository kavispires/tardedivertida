import { useEffect } from 'react';
// Ant Design Resources
import { MutedOutlined, SoundFilled } from '@ant-design/icons';
import { Switch, type SwitchProps } from 'antd';
// Hooks
import { useGlobalLocalStorage } from '@hooks/useGlobalLocalStorage';
// Internal
import { dailySoundEffects } from '../utils/soundEffects';

export function SoundFXToggle(
  props: Omit<SwitchProps, 'checked' | 'checkedChildren' | 'unCheckedChildren' | 'onClick'>,
) {
  const [volume, setVolume] = useGlobalLocalStorage('volume');

  useEffect(() => {
    dailySoundEffects.volume(volume);
  }, [volume]);

  const onSwitchClick = (checked: boolean) => {
    setVolume(checked ? 0.5 : 0);
  };

  return (
    <Switch
      checkedChildren={<SoundFilled />}
      unCheckedChildren={<MutedOutlined />}
      checked={!!volume}
      onClick={onSwitchClick}
      {...props}
    />
  );
}
