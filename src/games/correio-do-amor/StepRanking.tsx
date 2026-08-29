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
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { StepRankingWrapper } from '@components/results/StepRankingWrapper';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import { OUTCOME, POINTS } from './utils/constants';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: UseStep['goToPreviousStep'];
  outcome: string;
};

export function StepRanking({ players, ranking, goToPreviousStep, round, outcome }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Pontos por chegar mais próximo do amor verdadeiro"
          en="Points for getting closest to true love"
        />,
        <Translate
          key="2"
          pt="Bonus da carta que você usou"
          en="Bonus for the card you used"
        />,
        <Translate
          key="3"
          pt="Penalidade do Comilão"
          en="The Foodie's penalty"
        />,
        <Translate
          key="4"
          pt="Bonus do bêbado por ser eliminado"
          en="The Drunkard's bonus for being eliminated"
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

      {outcome === OUTCOME.END_GAME && (
        <RuleInstruction type="event">
          <Translate
            pt="Pelo menos um jogador chegou ao goal de {points} e o jogo acabou!"
            en="At least one player reached the goal of {points} and the game is over!"
            values={{ points: <PointsHighlight value={POINTS.GOAL} /> }}
          />
        </RuleInstruction>
      )}

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
