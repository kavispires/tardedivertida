// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StepRankingWrapper } from 'components/ranking';

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
      ]}
    >
      <SpaceContainer align="center">
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
