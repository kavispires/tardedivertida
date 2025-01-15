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
          pt="Pontos por chegar na cabana certa"
          en="Points for reaching the correct lodge"
        />,
        <Translate
          key="2"
          pt="Pontos pelas cabanas sem nenhuma aposta"
          en="Points for lodges without any bets"
        />,
        <Translate
          key="3"
          pt="Esquiador: pontos relativos às apostas em outros jogadores"
          en="Skier: points related to bets on other players"
        />,
        <Translate
          key="4"
          pt="Esquiador: pontos por cada jogador não apostado"
          en="Skier: points for each player not betted on"
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
