// Ant Design Resources
import { PictureOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Step } from 'components/steps';
import { RoundsLeftInstruction } from 'components/text';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  round: GameRound;
  goToPreviousStep: UseStep['goToPreviousStep'];
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

      {round.current < round.total && <RoundsLeftInstruction round={round} />}

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

      <HostNextPhaseButton round={round} />
    </Step>
  );
}
