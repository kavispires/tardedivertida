// Ant Design Resources
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
// Components
import { Step } from 'components/steps';
import { StepRankingWrapper } from 'components/ranking';
import { Translate } from 'components/language';
import { RoundsLeftInstruction } from 'components/text';
import { AdminNextPhaseButton } from 'components/admin';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  round: GameRound;
  goToPreviousStep: GenericFunction;
  setActiveIndex: GenericFunction;
  isLastRound?: boolean;
  correctGuessPoints: number;
};

export function StepRanking({
  players,
  ranking,
  round,
  goToPreviousStep,
  setActiveIndex,
  isLastRound = false,
  correctGuessPoints,
}: StepRankingProps) {
  return (
    <Step>
      <StepRankingWrapper
        players={players}
        ranking={ranking}
        gainedPointsDescriptions={[
          <Translate pt="Votos corretos" en="Correct guesses" />,
          <Translate
            pt="Votos corretos em seu sonho por outros jogadores"
            en="Correct guesses on your dream by other players"
          />,
          <Translate pt="Votos em pesadelos" en="Nightmares selected" />,
        ]}
      />

      {/* <PopoverRule content={<ScoringRules />} /> */}

      {round.current < round.total && <RoundsLeftInstruction round={round} lastRound={isLastRound} />}

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

      <AdminNextPhaseButton round={round} lastRound={isLastRound} />
    </Step>
  );
}
