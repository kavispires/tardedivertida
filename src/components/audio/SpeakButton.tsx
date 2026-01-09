// Ant Design Resources
import { Button, type ButtonProps } from 'antd';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { speak } from 'utils/speech';
// Icons
import { AudioIcon } from 'icons/AudioIcon';
// Components
import { IconAvatar } from 'components/avatars';

type SpeakButtonProps = {
  text: DualLanguageValue;
} & ButtonProps;

export function SpeakButton({ text, icon, ...buttonProps }: SpeakButtonProps) {
  const [volume] = useGlobalLocalStorage('volume');
  const { language } = useLanguage();

  return (
    <Button
      onClick={() => speak(text, language, volume || 0.5)}
      icon={
        <IconAvatar
          size="small"
          icon={icon ?? <AudioIcon />}
        />
      }
      {...buttonProps}
    />
  );
}
