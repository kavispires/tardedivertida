// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { GameRound, GameRanking } from 'types/game';
import type { UseStep } from 'hooks/useStep';
// Components
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { HostNextPhaseButton } from 'components/host';

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
        <Translate pt="Deu match com outros jogadores" en="Match other player's paris" />,
        <Translate
          pt="O item de fora foi o mesmo que outros jogadores"
          en="The left out item was the same as other players"
        />,
      ]}
    >
      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
