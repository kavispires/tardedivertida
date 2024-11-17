import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { useGameAppearance } from 'components/session/GameInfoContext';
// Images
import roundTitleEn from 'assets/images/round-title-en.svg';
import roundTitlePt from 'assets/images/round-title-pt.svg';

type RoundAnnouncementProps = {
  /**
   * The round object
   */
  round: GameRound;
  /**
   * Function to be called when the continue button is pressed
   */
  onPressButton?: GenericFunction;
  /**
   * Text to be displayed on the continue button
   */
  buttonText?: string;
  /**
   * Time in seconds to automatically press the continue button
   */
  time: number;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Optional children
   */
  children?: ReactNode;
  /**
   * If the announcement is unskippable
   */
  unskippable?: boolean;
};

export function RoundAnnouncement({
  round,
  onPressButton,
  buttonText,
  time = 0,
  className,
  children,
  unskippable = false,
}: RoundAnnouncementProps) {
  const appearance = useGameAppearance();
  const circleColor = appearance.primaryColor;
  useTemporarilyHidePlayersBar();
  const { translate } = useLanguage();

  const circleStyle = circleColor ? { borderColor: circleColor } : {};

  return (
    <div className={clsx('round-announcement', className)}>
      <div className="round-announcement__main">
        <div
          className={clsx(
            'round-announcement__title',
            appearance.colorScheme === 'dark' && 'round-announcement__title--dark'
          )}
        >
          <img src={translate(roundTitlePt, roundTitleEn)} alt={translate('Rodada', 'Round')} />
        </div>
        <div className={clsx('round-announcement__round-wrapper', getAnimationClass('zoomIn'))}>
          <div className="round-announcement__circle" style={circleStyle} />
          <div className="round-announcement__circle-2" style={circleStyle} />
          <div
            className={clsx(
              'round-announcement__number',
              appearance.colorScheme === 'dark' && 'round-announcement__number--dark'
            )}
          >
            {round?.current ?? round ?? 0}
          </div>
        </div>

        {children}

        {Boolean(onPressButton) && !Boolean(time) && (
          <Button type="primary" onClick={onPressButton} className="round-announcement__go-button">
            {buttonText}
          </Button>
        )}

        {Boolean(onPressButton) && Boolean(time) && (
          <TimedButton
            type="primary"
            onClick={onPressButton}
            onExpire={onPressButton}
            duration={time}
            disabled={unskippable}
          >
            <Translate pt="Prosseguir" en="Continue" custom={buttonText} />
          </TimedButton>
        )}
      </div>
    </div>
  );
}
