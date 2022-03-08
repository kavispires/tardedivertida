// Ant Design Resources
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
// Components
import {
  AdminNextRoundButton,
  PopoverRule,
  RankingBoard,
  RoundsLeftInstruction,
  Step,
  Title,
  Translate,
} from 'components';
import { ScoringRules } from './TextBlobs';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  isGameOver: boolean;
  round: GameRound;
  goToPreviousStep: GenericFunction;
  setActiveIndex: GenericFunction;
  isLastRound?: boolean;
};

export function StepRanking({
  players,
  ranking,
  isGameOver,
  round,
  goToPreviousStep,
  setActiveIndex,
  isLastRound,
}: StepRankingProps) {
  return (
    <Step>
      <Title>Ranking</Title>
      <RankingBoard players={players} ranking={ranking} />

      <PopoverRule content={<ScoringRules />} />

      {!isGameOver && <RoundsLeftInstruction round={round} />}

      <Button
        size="large"
        onClick={() => {
          goToPreviousStep();
          setActiveIndex(0);
        }}
        icon={<PictureOutlined />}
      >
        <Translate pt="Ver Galeria De Novo" en="See Gallery Again" />
      </Button>

      <AdminNextRoundButton round={round} lastRound={isLastRound} />
    </Step>
  );
}
