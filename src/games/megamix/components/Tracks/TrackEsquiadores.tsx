import clsx from 'clsx';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Icons
import { SkiingIcon } from '@icons/SkiingIcon';
import { SnowHillIcon } from '@icons/SnowHillIcon';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackEsquiadores = ({ track, onSubmitAnswer, user }: TrackProps) => {
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
  // TODO: Use useMouseDirection hook
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
      <MinigameTitle title={{ pt: 'O Esquiador', en: 'Ski Resorte' }} />
      <Space
        orientation="vertical"
        align="center"
        className="contained margin"
      >
        <RuleInstruction type="action">
          <Translate
            pt="Você tem os pensamentos mais filosóficos quando você está esquiando ladeira abaixo.<br/>Selecione a opção apropriada para a questão séria:"
            en="You have the most philosophical shower thoughts while skiing downhill.<br/>Select the best option below:"
          />
        </RuleInstruction>

        <SpaceContainer vertical>
          <div className="dd-animated-skiier">
            <Icon
              icon={<SkiingIcon />}
              size={84}
              className={clsx('dd-animated-skiier__skiier', `dd-animated-skiier__skiier--${direction}`)}
            />
          </div>
          <TextCard
            header={translate({ pt: 'Dica', en: 'Clue' })}
            color="red"
          >
            {track.data.dilemma.prompt}
          </TextCard>

          <SpaceContainer>
            <div className="dd-buttons">
              <TransparentButton
                onClick={() => onSelect(track.data.dilemma.left)}
                disabled={user.ready || isLoading}
                className="dd-button"
              >
                <span className="dd-button__hill dd-button__hill--left">
                  <Icon
                    icon={<SnowHillIcon />}
                    size={64}
                  />
                </span>
                <span className="dd-button__text">{track.data.dilemma.left}</span>
              </TransparentButton>
              <TransparentButton
                onClick={() => onSelect(track.data.dilemma.right)}
                disabled={user.ready || isLoading}
                className="dd-button"
              >
                <span className="dd-button__hill">
                  <Icon
                    icon={<SnowHillIcon />}
                    size={64}
                  />
                </span>
                <span className="dd-button__text">{track.data.dilemma.right}</span>
              </TransparentButton>
            </div>
          </SpaceContainer>
        </SpaceContainer>
      </Space>
    </>
  );
};
