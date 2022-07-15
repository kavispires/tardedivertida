import clsx from 'clsx';
// Ant Design Resources
import { Button } from 'antd';
// Assets
import roundTitleEn from 'assets/images/round-title-en.svg';
import roundTitlePt from 'assets/images/round-title-pt.svg';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { Translate } from 'components/language';
import { TimedButton } from 'components/buttons';

type RoundAnnouncementProps = {
  round: GameRound;
  onPressButton?: GenericFunction;
  buttonText?: string;
  time: number;
  players?: Players;
  className?: string;
  children?: any;
  unskippable?: boolean;
  circleColor?: Color;
};

export function RoundAnnouncement({
  round,
  onPressButton,
  buttonText,
  time = 0,
  className,
  children,
  unskippable = false,
  circleColor = 'yellow',
}: RoundAnnouncementProps) {
  const { translate } = useLanguage();

  return (
    <div className={clsx('round-announcement', className)}>
      <div className="round-announcement__main">
        <div className="round-announcement__title">
          <img src={translate(roundTitlePt, roundTitleEn)} alt={translate('Rodada', 'Round')} />
        </div>
        <div className={clsx('round-announcement__round-wrapper', getAnimationClass('zoomIn'))}>
          <div className={clsx('round-announcement__circle', `color-border--${circleColor}`)}></div>
          <div className={clsx('round-announcement__circle-2', `color-border--${circleColor}`)}></div>
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
