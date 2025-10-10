// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StepRankingWrapper } from 'components/ranking';

type StepRankingProps = {
  ranking: GameRanking;
  players: GamePlayers;
  onGoBack: () => void;
  round: GameRound;
};

export function StepRanking({ ranking, players, onGoBack, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate key="1" pt="5 pontos por identidades corretas" en="5 points for correct identities" />,
        <Translate
          key="2"
          pt="2 pontos por jogadores que identificaram você corretamente"
          en="2 points for players who identified you correctly"
        />,
      ]}
    >
      <SpaceContainer>
        <Button onClick={onGoBack}>
          <Translate pt="Ver galeria novamente" en="See gallery again" />
        </Button>
      </SpaceContainer>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
