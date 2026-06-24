// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { StepRankingWrapper } from '@components/wrappers/StepRankingWrapper';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  onGoBack: () => void;
};

export function StepRanking({ players, ranking, onGoBack, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Pares corretos"
          en="Correct matches"
        />,
        <Translate
          key="2"
          pt="Pontos por seu desenho"
          en="Points for your drawing"
        />,
      ]}
    >
      <SpaceContainer>
        <Button onClick={onGoBack}>
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
