import clsx from "clsx";
import { ReactNode, useState } from "react";
import { useKeyPressEvent } from "react-use";
// Ant Design Resources
import { Button } from "antd";
// Hooks
import { useCountdown } from "hooks/useCountdown";
import { useTemporarilyHidePlayersBar } from "hooks/useTemporarilyHidePlayersBar";
// Utils
import { type AnimationType, getAnimationClass } from "utils/helpers";
// Components
import { TimedButton } from "components/buttons";
import { Translate } from "components/language";
import { Title } from "components/text";
// Sass
import "./PhaseAnnouncement.scss";
// Design Resource

type PhaseAnnouncementBasicProps = {
  /**
   * The title of the game phase
   */
  title: ReactNode;
  /**
   * The icon displayed to illustrate the phase
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
  type?: "block" | "overlay";
};

type PhaseAnnouncementBlock = {
  /**
   * The phase announcement will be its own screen without overlaying any content
   */
  type: "block";
  /**
   * The function called when the close button is clicked
   */
  onClose: GenericFunction;
} & PhaseAnnouncementBasicProps;

type PhaseAnnouncementOverlay = {
  /**
   * The phase announcement will be its own screen without overlaying any content
   */
  type: "overlay";
  /**
   * The function called when the close button is clicked
   */
  onClose?: GenericFunction;
} & PhaseAnnouncementBasicProps;

type PhaseAnnouncementProps = PhaseAnnouncementBlock | PhaseAnnouncementOverlay;

/**
 * Screen displayed before (or over) any game phase with title and illustration and some simple instruction
 */
export function PhaseAnnouncement({
  buttonText,
  icon,
  title,
  children,
  currentRound = 3,
  onClose = () => {},
  className,
  duration,
  withoutTimer = false,
  unskippable,
  animationType = "backInDown",
  type = "block",
}: PhaseAnnouncementProps) {
  useTemporarilyHidePlayersBar(type === "overlay");
  const durationPerRound = [7, 15, 7, 5]?.[currentRound] ?? 4;
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
  useKeyPressEvent(" ", () => {
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
        type === "overlay" && "phase-announcement-overlay",
        !isActive && getAnimationClass("fadeOut", { speed: "faster" }),
      )}
    >
      <div className="phase-announcement-wrapper">
        <div
          className={clsx(
            "phase-announcement",
            isActive
              ? getAnimationClass(animationType, { speed: "fast" })
              : getAnimationClass("bounceOut"),
            className,
          )}
        >
          <Title colorScheme="light">{title}</Title>

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
    </div>
  );
}
