// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { StepRankingWrapper } from '@components/wrappers/StepRankingWrapper';

type StepRankingProps = {
  ranking: GameRanking;
  players: GamePlayers;
  round: GameRound;
  goToPreviousStep: UseStep['goToPreviousStep'];
};

export function StepRanking({ ranking, players, round, goToPreviousStep }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Mais votado"
          en="Most votes"
        />,
        <Translate
          key="2"
          pt="Recebeu pelo menos 1 voto"
          en="Got at least 1 vote"
        />,
        <Translate
          key="3"
          pt="Pontos da testemunha"
          en="Witness points"
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
