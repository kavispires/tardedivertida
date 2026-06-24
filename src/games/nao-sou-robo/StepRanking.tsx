// Ant Design Resources
import { Button, Flex } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { StepRankingWrapper } from '@components/wrappers/StepRankingWrapper';

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
          pt="Cartas que não era do robô"
          en="Cards that were not from the robot"
        />,
        <Translate
          key="2"
          pt="Escolheu cartas do robô"
          en="Chose cards from the robot"
        />,
      ]}
    >
      <Flex justify="center">
        <Button onClick={goToPreviousStep}>
          <Translate
            pt="Ver resultado novamente"
            en="See results again"
          />
        </Button>
      </Flex>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
