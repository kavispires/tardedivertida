import { ReactNode, useState } from 'react';
// Types
import type { GameState } from 'types/game';
import type { GameInfo } from 'types/game-info';
import type { GamePlayers } from 'types/player';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { TheEndIcon } from 'icons/TheEndIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { GameOver } from './GameOver';

type GameOverWrapperProps = {
  /**
   * The game info
   */
  info: GameInfo;
  /**
   * The game state
   */
  state: GameState;
  /**
   * The game players
   */
  players: GamePlayers;
  /**
   * The additional content of the screen
   */
  children?: ReactNode;
  /**
   * Custom announcement icon (default: TheEndIcon)
   */
  announcementIcon?: ReactNode;
  /**
   * CUstom announcement title
   */
  announcementTitle?: ReactNode;
  /**
   * Custom announcement duration (default: 3)
   */
  announcementDuration?: number;
  /**
   * Custom announcement content
   */
  announcementContent?: ReactNode;
  /**
   * Customize rate widget text
   */
  rateWidgetCustomText?: ReactNode;
};

export function GameOverWrapper({
  info,
  state,
  players,
  announcementIcon = <TheEndIcon />,
  announcementTitle,
  announcementDuration = 3,
  announcementContent,
  children = <></>,
  rateWidgetCustomText,
}: GameOverWrapperProps) {
  const [step] = useState(0);

  const announcement = (
    <PhaseAnnouncement
      icon={announcementIcon}
      title={
        <Translate pt="E o jogo chegou ao fim..." en="And the game is over..." custom={announcementTitle} />
      }
      currentRound={state?.round?.current}
      duration={announcementDuration}
      type="overlay"
    >
      {Boolean(announcementContent) && announcementContent}
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DEFAULT.GAME_OVER}
      className="game-over__container"
    >
      <StepSwitcher step={step} players={players}>
        {/*Step 0 */}
        <GameOver
          state={state}
          info={info}
          rateWidgetCustomText={rateWidgetCustomText}
          announcement={announcement}
        >
          {children}
        </GameOver>
      </StepSwitcher>
    </PhaseContainer>
  );
}
