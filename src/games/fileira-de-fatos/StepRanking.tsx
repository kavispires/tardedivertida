// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { StepRankingWrapper } from 'components/ranking';
import { RuleInstruction } from 'components/text';
// Internal
import { RoundTypeExplanation } from './components/RoundTypeExplanation';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: UseStep['goToPreviousStep'];
  roundType: string;
};

export function StepRanking({ players, ranking, goToPreviousStep, round, roundType }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Posições corretas" en="Correct positions" />,
        <Translate pt="Penalidade em rodadas especiais" en="Penalty in special rounds" />,
        <Translate pt="Bonus por acertar todos" en="Bonus points for getting all correct" />,
      ]}
    >
      <RuleInstruction type="alert">
        <Translate
          pt={
            <>
              Acertar todos os cenários da rodada dá <PointsHighlight>2 pontos bônus</PointsHighlight>.
            </>
          }
          en={
            <>
              Matching all scenarios in the round gives <PointsHighlight>2 bonus points</PointsHighlight>.
            </>
          }
        />
        <br />
      </RuleInstruction>
      <RoundTypeExplanation roundType={roundType} />

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
