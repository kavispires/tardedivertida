import type { ReactNode } from 'react';
// Ant Design Resources
import { CaretUpOutlined } from '@ant-design/icons';
// Types
import type { GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Translate } from 'components/language';
import { useGameAppearance } from 'components/session/GameInfoContext';
import { Step } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import { RankingBoard } from './RankingBoard';

type StepRankingWrapperProps = {
  /**
   * The players
   */
  players: GamePlayers;
  /**
   * The ranking array
   */
  ranking: GameRanking;
  /**
   * Gained points descriptions for the popover
   */
  gainedPointsDescriptions: ReactNode[];
  /**
   * Additional content
   */
  children?: ReactNode;
  /**
   * Replacement title for Ranking
   */
  title?: ReactNode;
  /**
   * Optional node that goes under the title
   */
  subtitle?: ReactNode;
  /**
   * Whether the title should be white or not
   */
  colorScheme?: ColorScheme;
  /**
   * Index of the ranking that should be highlighted with a crown
   */
  victoryIndex?: number;
  /**
   * How long the ranking board should be delayed before showing
   */
  delay?: number;
};

export function StepRankingWrapper({
  players,
  ranking,
  gainedPointsDescriptions,
  children,
  title,
  subtitle,
  colorScheme,
  victoryIndex = 0,
  delay = 0,
}: StepRankingWrapperProps) {
  useTemporarilyHidePlayersBar();
  const appearance = useGameAppearance();

  const scheme = colorScheme ?? appearance.colorScheme ?? 'light';

  return (
    <Step>
      <StepTitle colorScheme={scheme}>{title ?? 'Ranking'}</StepTitle>

      {subtitle}

      <RankingBoard
        players={players}
        ranking={ranking}
        gainedPointsDescriptions={gainedPointsDescriptions}
        victoryIndex={victoryIndex}
        delay={delay}
      />
      <Instruction className="step-ranking-wrapper-gained-points-instruction" colorScheme={scheme}>
        <CaretUpOutlined />
        <Translate
          pt="Passe o mouse em cada um dos pontos para saber como eles foram distribuídos"
          en="Hover over the scores to learn how they were granted"
        />
        <CaretUpOutlined />
      </Instruction>

      {children}
    </Step>
  );
}
