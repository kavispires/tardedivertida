import { ReactNode, useState } from 'react';
import clsx from 'clsx';
// Design Resource
import { Button } from 'antd';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { TimedButton } from 'components/buttons';
import { useKeyPressEvent } from 'react-use';
import { useCountdown } from 'hooks/useCountdown';

type PhaseAnnouncementProps = {
  /**
   * The title of the game phase
   */
  title: ReactNode;
  /**
   * The function called when the close button is clicked
   */
  onClose?: GenericFunction;
  /**
   * The icon displayed to illustrate the phase (default: MultitaskIcon)
   */
  icon: ReactNode;
  /**
   * The Text
   */
  buttonText?: ReactNode;
  /**
   * Additional content of the announcement, usually a simple instruction
   */
  children?: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Current round number (default 0)
   */
  currentRound?: number;
  /**
   * Duration to override default duration.
   * The default duration follows the current round going for 15, 10, then 5 seconds
   */
  duration?: number;
  /**
   * Prevents user from skipping the the announcement card
   */
  unskippable?: boolean;
  /**
   * Removes timer from the continue button
   */
  withoutTimer?: boolean;
  /**
   * In animation for the announcement
   */
  animationType?: AnimationType;
  /**
   * If component should be an overlay or a block
   */
  type?: 'block' | 'overlay';
};

/**
 * Screen displayed before (or over) any game phase with title and illustration and some simple instruction
 */
export function PhaseAnnouncement({
  buttonText,
  icon,
  title,
  children,
  currentRound = 0,
  onClose = () => {},
  className,
  duration,
  withoutTimer = false,
  unskippable,
  animationType = 'backInDown',
  type = 'block',
}: PhaseAnnouncementProps) {
  useTemporarilyHidePlayersBar(type === 'overlay');
  const durationPerRound = [15, 7, 5]?.[currentRound] ?? 4;
  const [isActive, setActive] = useState(true);
  const [isRemoved, setRemoved] = useState(false);

  /**
   * Deactivate component (triggering animation)
   * Start timer to remove it from dom
   * Perform the onClose function
   */
  const onContinue = () => {
    setActive(false);
    start();
    onClose();
  };

  // Allow skip when pressing the space bar in a skippable announcement
  useKeyPressEvent(' ', () => {
    if (!unskippable) {
      onContinue();
    }
  });

  /**
   * When the overlay is dismissed the component needs to disappear so the screen
   * components can be clickable again
   */
  const { start } = useCountdown({
    autoStart: false,
    duration: 1,
    onExpire: () => setRemoved(true),
  });

  if (isRemoved) {
    return <></>;
  }

  return (
    <div
      className={clsx(
        type === 'overlay' && 'phase-announcement-overlay',
        !isActive && getAnimationClass('fadeOut')
      )}
    >
      <div
        className={clsx(
          'phase-announcement',
          isActive
            ? getAnimationClass(animationType, undefined, 'fast')
            : getAnimationClass('bounceOut', undefined),
          className
        )}
      >
        <Title>{title}</Title>

        <span className="phase-announcement__icon">{icon}</span>

        {children}

        {withoutTimer ? (
          <Button type="primary" onClick={onContinue} autoFocus>
            <Translate pt="Prosseguir" en="Continue" custom={buttonText} />
          </Button>
        ) : (
          <TimedButton
            duration={duration || durationPerRound}
            type="text"
            onClick={onContinue}
            onExpire={onContinue}
            disabled={unskippable}
            autoFocus
          >
            <Translate pt="Prosseguir" en="Continue" custom={buttonText} />
          </TimedButton>
        )}
      </div>
    </div>
  );
}
