// Ant Design Resources
import { Button, Flex } from 'antd';
// Components
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { VIPNextPhaseButton } from 'components/vip';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: GenericFunction;
};

export function StepRanking({ players, ranking, goToPreviousStep, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Cartas que não era do robô" en="Cards that were not from the robot" />,
        <Translate pt="Escolheu cartas do robô" en="Chose cards from the robot" />,
      ]}
    >
      <Flex justify="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Flex>
      <VIPNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}