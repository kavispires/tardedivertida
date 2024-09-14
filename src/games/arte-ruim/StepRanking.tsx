// Ant Design Resources
import { PictureOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { StepRankingWrapper } from 'components/ranking';
import { PopoverRule } from 'components/rules';
import { Instruction, RoundsLeftInstruction } from 'components/text';
// Internal
import { ScoringRules } from './components/TextBlobs';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  isGameOver: boolean;
  round: GameRound;
  goToPreviousStep: UseStep['goToPreviousStep'];
  setActiveIndex: GenericFunction;
  threshold: number;
};

export function StepRanking({
  players,
  ranking,
  isGameOver,
  round,
  goToPreviousStep,
  setActiveIndex,
  threshold,
}: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Votos corretos" en="Correct guesses" />,
        <Translate
          pt="Votos corretos em seu desenho por outros jogadores"
          en="Correct guesses on your drawing by other players"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRules />} />

      {threshold > 0 && (
        <Instruction contained>
          <Translate
            pt={
              <>
                O jogo termina quando alguém passa os <PointsHighlight>{threshold} pontos</PointsHighlight> ou{' '}
                {round.total} rodadas.
              </>
            }
            en={
              <>
                The game ends when someones passes <PointsHighlight>{threshold} points</PointsHighlight> or{' '}
                {round.total} rounds.
              </>
            }
          />
        </Instruction>
      )}

      {!isGameOver && <RoundsLeftInstruction round={round} />}

      <Button
        size="large"
        onClick={() => {
          goToPreviousStep();
          setActiveIndex(0);
        }}
        icon={<PictureOutlined />}
      >
        <Translate pt="Ver Galeria Novamente" en="See Gallery Again" />
      </Button>

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
