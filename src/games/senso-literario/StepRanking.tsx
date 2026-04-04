// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from 'components/host/HostNextPhaseButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StepRankingWrapper } from 'components/ranking/StepRankingWrapper';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goBack: () => void;
};

export function StepRanking({ players, ranking, goBack, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          en="1 point for each attribute you chose that matches at least one other player"
          pt="1 ponto para cada atributo que você escolheu que combina com pelo menos outro jogador"
        />,
        <Translate
          key="2"
          pt="1 ponto bônus se a carta inteira combinou com outros jogadores"
          en="1 bonus point if your entire card matched other players"
        />,
      ]}
    >
      <SpaceContainer>
        <Button onClick={goBack}>
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
