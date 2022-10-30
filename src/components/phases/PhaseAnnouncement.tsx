import { ReactNode } from 'react';
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

type PhaseAnnouncementProps = {
  /**
   * The title of the game phase
   */
  title: ReactNode;
  /**
   * The function called when the close button is clicked
   */
  onClose: GenericFunction;
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
};

/**
 * Screen displayed before any game phase with title and illustration and some simple instruction
 */
export function PhaseAnnouncement({
  buttonText,
  icon,
  title,
  children,
  currentRound = 0,
  onClose,
  className,
  duration,
  withoutTimer = false,
  unskippable,
  animationType = 'backInDown',
}: PhaseAnnouncementProps) {
  useTemporarilyHidePlayersBar();
  const durationPerRound = [15, 10, 5]?.[currentRound] ?? 5;

  // Allow skip when pressing the space bar in a skippable announcement
  useKeyPressEvent(' ', () => {
    if (!unskippable) {
      onClose();
    }
  });

  return (
    <div className={clsx('phase-announcement', getAnimationClass(animationType), className)}>
      <Title>{title}</Title>

      <span className="phase-announcement__icon">{icon}</span>

      {children}

      {withoutTimer ? (
        <Button type="primary" onClick={onClose}>
          <Translate pt="Prosseguir" en="Continue" custom={buttonText} />
        </Button>
      ) : (
        <TimedButton
          duration={duration || durationPerRound}
          type="text"
          onClick={onClose}
          onExpire={onClose}
          disabled={unskippable}
        >
          <Translate pt="Prosseguir" en="Continue" custom={buttonText} />
        </TimedButton>
      )}
    </div>
  );
}
