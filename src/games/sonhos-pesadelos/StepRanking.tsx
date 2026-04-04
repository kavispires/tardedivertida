// Ant Design Resources
import { PictureOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from 'components/host/HostNextPhaseButton';
import { Translate } from 'components/language/Translate';
import { StepRankingWrapper } from 'components/ranking/StepRankingWrapper';
import { Step } from 'components/steps/Step';
import { RoundsLeftInstruction } from 'components/text/RoundsLeftInstruction';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  round: GameRound;
  onGoBack: () => void;
  isLastRound?: boolean;
};

export function StepRanking({ players, ranking, round, onGoBack }: StepRankingProps) {
  return (
    <Step>
      <StepRankingWrapper
        players={players}
        ranking={ranking}
        gainedPointsDescriptions={[
          <Translate
            key="1"
            pt="Votos corretos"
            en="Correct guesses"
          />,
          <Translate
            key="2"
            pt="Votos corretos em seu sonho por outros jogadores"
            en="Correct guesses on your dream by other players"
          />,
          <Translate
            key="3"
            pt="Votos em pesadelos"
            en="Nightmares selected"
          />,
        ]}
      />

      {/* <PopoverRule content={<ScoringRules />} /> */}

      {round.current < round.total && <RoundsLeftInstruction round={round} />}

      <Button
        size="large"
        onClick={onGoBack}
        icon={<PictureOutlined />}
      >
        <Translate
          pt="Ver Galeria De Novo"
          en="See Gallery Again"
        />
      </Button>

      <HostNextPhaseButton round={round} />
    </Step>
  );
}
