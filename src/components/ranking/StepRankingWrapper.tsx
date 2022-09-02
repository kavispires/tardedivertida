import { ReactNode } from 'react';
// Ant Design Resources
import { CaretUpOutlined } from '@ant-design/icons';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
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
};

export function StepRankingWrapper({
  players,
  ranking,
  gainedPointsDescriptions,
  children,
  title,
  subtitle,
}: StepRankingWrapperProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step>
      <Title>{title ?? 'Ranking'}</Title>

      {subtitle}

      <RankingBoard players={players} ranking={ranking} gainedPointsDescriptions={gainedPointsDescriptions} />
      <Instruction contained className="step-ranking-wrapper-gained-points-instruction">
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
