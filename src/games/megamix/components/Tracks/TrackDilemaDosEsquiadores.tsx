import clsx from 'clsx';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { SkiingIcon } from 'icons/SkiingIcon';
import { SnowHillIcon } from 'icons/SnowHillIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackDilemaDosEsquiadores = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([track.data.dilemma.left, track.data.dilemma.right]));
  });

  const [mouseX, setMouseX] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Check if the mouse is on the left or right side of the screen
    if (mouseX !== null) {
      const screenWidth = window.innerWidth;
      const threshold = screenWidth / 2;

      if (mouseX <= threshold) {
        setDirection('left');
      } else {
        setDirection('right');
      }
    }
  }, [mouseX]);

  return (
    <>
      <MinigameTitle title={{ pt: 'Dilema do Esquiador', en: "Skiers' Dilemma" }} />
      <Space direction="vertical" align="center" className="contained margin">
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Você tem os pensamentos mais filosóficos quando você está esquiando ladeira abaixo.
                <br />
                Selecione a opção apropriada para a questão séria:
              </>
            }
            en={
              <>
                You have the most philosophical shower thoughts while skiing downhill.
                <br />
                Select the best option below:
              </>
            }
          />
        </RuleInstruction>

        <Space className="space-container" direction="vertical">
          <div className="dd-animated-skiier">
            <IconAvatar
              icon={<SkiingIcon />}
              size={84}
              className={clsx('dd-animated-skiier__skiier', `dd-animated-skiier__skiier--${direction}`)}
            />
          </div>
          <Card header={translate('Dica', 'Clue')} color="red">
            {track.data.dilemma.prompt}
          </Card>

          <Space className="space-container">
            <div className="dd-buttons">
              <TransparentButton
                onClick={() => onSelect(track.data.dilemma.left)}
                disabled={user.ready || isLoading}
                className="dd-button"
              >
                <span className="dd-button__hill dd-button__hill--left">
                  <IconAvatar icon={<SnowHillIcon />} size={64} />
                </span>
                <span className="dd-button__text">{track.data.dilemma.left}</span>
              </TransparentButton>
              <TransparentButton
                onClick={() => onSelect(track.data.dilemma.right)}
                disabled={user.ready || isLoading}
                className="dd-button"
              >
                <span className="dd-button__hill">
                  <IconAvatar icon={<SnowHillIcon />} size={64} />
                </span>
                <span className="dd-button__text">{track.data.dilemma.right}</span>
              </TransparentButton>
            </div>
          </Space>
        </Space>
      </Space>
    </>
  );
};
