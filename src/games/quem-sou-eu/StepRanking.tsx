// Ant Design Resources
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
import type { GameRound, GameRanking } from 'types/game';
import type { UseStep } from 'hooks/useStep';
// Components
import { RoundsLeftInstruction } from 'components/text';
import { StepRankingWrapper } from 'components/ranking';
import { PopoverRule } from 'components/rules';
import { Translate } from 'components/language';
import { HostNextPhaseButton } from 'components/host';
import { ScoringRules } from './components/RulesBlobs';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  round: GameRound;
  goToPreviousStep: UseStep['goToPreviousStep'];
  setActiveIndex: GenericFunction;
};

export function StepRanking({ players, ranking, round, goToPreviousStep, setActiveIndex }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Votos corretos" en="Correct guesses" />,
        <Translate
          pt="Votos corretos em seu personagem por outros jogadores"
          en="Correct guesses on your character by other players"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRules currentRound={round.current} />} />

      <RoundsLeftInstruction round={round} />

      <Button
        size="large"
        onClick={() => {
          goToPreviousStep();
          setActiveIndex(0);
        }}
        icon={<PictureOutlined />}
      >
        <Translate pt="Ver Galeria Novamente" en="See Gallery Again" />
      </Button>

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
