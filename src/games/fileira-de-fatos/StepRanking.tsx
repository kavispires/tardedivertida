// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
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
        <Translate
          key="1"
          pt="Posições corretas"
          en="Correct positions"
        />,
        <Translate
          key="2"
          pt="Penalidade em rodadas especiais"
          en="Penalty in special rounds"
        />,
        <Translate
          key="3"
          pt="Bonus por acertar todos"
          en="Bonus points for getting all correct"
        />,
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
