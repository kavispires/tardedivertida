import clsx from 'clsx';
// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Images
import roundTitleEn from 'assets/images/round-title-en.svg';
import roundTitlePt from 'assets/images/round-title-pt.svg';
// Assets

type RoundAnnouncementProps = {
  round: GameRound;
  onPressButton?: GenericFunction;
  buttonText?: string;
  time: number;
  players?: GamePlayers;
  /**
   * Optional custom class name
   */
  className?: string;
  children?: any;
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
  const info = useGameInfoContext();
  const circleColor = info.appearance.primaryColor;
  useTemporarilyHidePlayersBar();
  const { translate } = useLanguage();

  const circleStyle = circleColor ? { borderColor: circleColor } : {};

  return (
    <div className={clsx('round-announcement', className)}>
      <div className="round-announcement__main">
        <div className="round-announcement__title">
          <img src={translate(roundTitlePt, roundTitleEn)} alt={translate('Rodada', 'Round')} />
        </div>
        <div className={clsx('round-announcement__round-wrapper', getAnimationClass('zoomIn'))}>
          <div className="round-announcement__circle" style={circleStyle} />
          <div className="round-announcement__circle-2" style={circleStyle} />
          <div className="round-announcement__number">{round?.current ?? round ?? 0}</div>
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
