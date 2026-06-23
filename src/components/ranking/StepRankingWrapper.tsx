import type { ReactNode } from 'react';
// Ant Design Resources
import { CaretUpOutlined } from '@ant-design/icons';
// Types
import type { GameRanking, GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { useGameAppearance } from '@components/session/GameInfoContext';
import { Step } from '@components/steps/Step';
import { Instruction } from '@components/text/Instruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { RankingBoard } from './RankingBoard';
// Sass
import styles from './ranking.module.scss';

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

/**
 * Step wrapper component that displays ranking board with optional title, subtitle, and additional content
 */
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
  const appearance = useGameAppearance();

  const scheme = colorScheme ?? appearance.colorScheme ?? 'light';

  return (
    <Step hidePlayersBar>
      <StepTitle colorScheme={scheme}>{title ?? 'Ranking'}</StepTitle>

      {subtitle}

      <RankingBoard
        players={players}
        ranking={ranking}
        gainedPointsDescriptions={gainedPointsDescriptions}
        victoryIndex={victoryIndex}
        delay={delay}
      />
      <Instruction
        className={styles.stepRankingWrapperGainedPointsInstruction}
        colorScheme={scheme}
      >
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
