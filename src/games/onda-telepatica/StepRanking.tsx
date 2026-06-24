// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PopoverRule } from '@components/rules/PopoverRule';
import { StepRankingWrapper } from '@components/wrappers/StepRankingWrapper';
// Internal
import { ScoringRules } from './components/RulesBlobs';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: UseStep['goToPreviousStep'];
};

export function StepRanking({ players, ranking, goToPreviousStep, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Escolha correta ou próxima"
          en="Correct or close guess"
        />,
        <Translate
          key="2"
          pt="Pontos do Medium"
          en="Psychic points"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRules />} />
      <SpaceContainer>
        <Button onClick={goToPreviousStep}>
          <Translate
            pt="Ver resultado novamente"
            en="See results again"
          />
        </Button>
      </SpaceContainer>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
