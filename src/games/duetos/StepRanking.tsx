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
          pt="Deu match com outros jogadores"
          en="Match other player's pairs"
        />,
        <Translate
          key="2"
          pt="O item de fora foi o mesmo que outros jogadores"
          en="The left out item was the same as other players"
        />,
      ]}
    >
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
