import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { RankingBoard } from './RankingBoard';

type StepRankingWrapperProps = {
  players: GamePlayers;
  ranking: GameRanking;
  gainedPointsDescriptions: any[];
  children?: ReactChildren;
};

export function StepRankingWrapper({
  players,
  ranking,
  gainedPointsDescriptions,
  children,
}: StepRankingWrapperProps) {
  return (
    <Step>
      <Title>Ranking</Title>

      <Instruction contained>
        <Translate
          pt="Passe o mouse em cada um dos pontos para saber como eles foram distribuídos"
          en="Hover over the scores to learn how they were granted"
        />
      </Instruction>

      <RankingBoard players={players} ranking={ranking} gainedPointsDescriptions={gainedPointsDescriptions} />

      {children}
    </Step>
  );
}