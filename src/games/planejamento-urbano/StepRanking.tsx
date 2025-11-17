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
        <Translate key="1" pt="Acertou o planejamento do arquiteto" en="Match the architect's plan" />,
        <Translate
          key="2"
          pt="Pontos do Arquiteto para cada jogador que acertou o planejamento"
          en="Architect points for each player who matched the plan"
        />,
        <Translate
          key="3"
          pt="Pontos por dar match com outros jogadores no cone errado"
          en="Points for matching with other players on the wrong cone"
        />,
      ]}
    >
      <SpaceContainer>
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </SpaceContainer>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
