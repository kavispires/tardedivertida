// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { StepRankingWrapper } from '@components/results/StepRankingWrapper';

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
          pt="Pontos para pedidos corretos"
          en="Points for correct orders"
        />,
        <Translate
          key="2"
          pt="Pontos perdidos por pedidos errados"
          en="Points lost for wrong orders"
        />,
        <Translate
          key="3"
          pt="Pontos por marcar um produto como fora de estoque corretamente"
          en="Points for correctly marking a product as out of stock"
        />,
        <Translate
          key="4"
          pt="Pontos por marcar um produto como fora de estoque incorretamente"
          en="Points for incorrectly marking a product as out of stock"
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
