// Ant Design Resources
import { PictureOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PopoverRule } from '@components/rules/PopoverRule';
import { RoundsLeftInstruction } from '@components/text/RoundsLeftInstruction';
import { StepRankingWrapper } from '@components/wrappers/StepRankingWrapper';
// Internal
import { ScoringRules } from './components/TextBlobs';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  isGameOver: boolean;
  round: GameRound;
  onGoBack: () => void;
  threshold: number;
};

export function StepRanking({ players, ranking, isGameOver, round, onGoBack, threshold }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Votos corretos"
          en="Correct guesses"
        />,
        <Translate
          key="2"
          pt="Votos corretos em seu desenho por outros jogadores"
          en="Correct guesses on your drawing by other players"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRules />} />

      {threshold > 0 && (
        <Surface contained>
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
        </Surface>
      )}

      {!isGameOver && <RoundsLeftInstruction round={round} />}

      <Button
        size="large"
        onClick={onGoBack}
        icon={<PictureOutlined />}
      >
        <Translate
          pt="Ver Galeria Novamente"
          en="See Gallery Again"
        />
      </Button>

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
