// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { StepRankingWrapper } from '@components/results/StepRankingWrapper';
// Internal
import type { GalleryEntry } from './utils/types';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  gallery: GalleryEntry[];
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
          pt="2 pontos por cada acerto dos pares de outros jogadores"
          en="2 points for each match of other players' pairs"
        />,
        <Translate
          key="2"
          pt="1 ponto para cada vez que um jogador acerta o seu par"
          en="1 point for each time a player matches your pair"
        />,
        <Translate
          key="3"
          pt="3 pontos por acertar a coisa final a ser comprada"
          en="3 points for correctly guessing the final item to be purchased"
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
