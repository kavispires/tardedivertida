import { PlayCircleFilled } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useEffect } from 'react';
import { speak } from 'utils/speech';

type SpeakProps = {
  text: DualLanguageValue;
};

export function Speak({ text }: SpeakProps) {
  const [volume] = useGlobalState('volume');
  const { language } = useLanguage();

  // Updated volume
  useEffect(() => {
    speak(text, language, volume);
  }, [volume]); // eslint-disable-line

  return <></>;
}

export function SpeakButton({ text, ...buttonProps }: SpeakProps & ButtonProps) {
  const { language } = useLanguage();
  return (
    <Button shape="circle" {...buttonProps} onClick={() => speak(text, language, 0.5)}>
      <PlayCircleFilled />
    </Button>
  );
}
