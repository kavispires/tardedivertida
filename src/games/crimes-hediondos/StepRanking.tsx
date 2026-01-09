// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StepRankingWrapper } from 'components/ranking';

type StepRankingProps = {
  ranking: GameRanking;
  players: GamePlayers;
  goToPreviousStep: UseStep['goToPreviousStep'];
  round: GameRound;
};

export function StepRanking({ ranking, players, goToPreviousStep, round }: StepRankingProps) {
  const roundPoints = round.total - round.current + 1;

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt={<>Pares corretos ganham {roundPoints} pontos nessa rodada. 1 ponto a menos na próxima.</>}
          en={<>Correct pairs get {roundPoints} points this round. 1 point less next round.</>}
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
