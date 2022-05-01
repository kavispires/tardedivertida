// Ant Design Resources
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
// Components
import { RoundsLeftInstruction } from 'components/text';
import { StepRankingWrapper } from 'components/ranking';
import { PopoverRule } from 'components/rules';
import { Translate } from 'components/language';
import { AdminNextRoundButton } from 'components/admin';
import { ScoringRules } from './components/TextBlobs';

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
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Votos corretos" en="Correct guesses" />,
        <Translate
          pt="Votos corretos em seu desenho por outros jogadores"
          en="Correct guesses on your drawing by other players"
        />,
      ]}
    >
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
    </StepRankingWrapper>
  );
}
