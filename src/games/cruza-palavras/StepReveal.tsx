import { useMemo } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { AVATARS as avatars } from 'utils/avatars';
import { getMeanDuration } from 'utils/helpers';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TitledContainer } from 'components/layout/TitledContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Clue, Grid, GridType, ResultPlayerCell } from './utils/types';
import { WordGrid } from './components/WordGrid';
import { ScoringRule } from './components/RulesBlobs';
import { BadCluesPlayersList } from './components/BadCluesPlayersList';
import { AnswersTable } from './components/AnswersTable';
import { ResultCell } from './components/ResultCell';

const AVATARS: PlainObject = avatars;

type StepRevealProps = {
  players: GamePlayers;
  grid: Grid;
  gridType: GridType;
  user: GamePlayer;
  clues: Clue[];
  goToNextStep: UseStep['goToNextStep'];
  whoGotNoPoints: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  grid,
  gridType,
  user,
  players,
  clues,
  goToNextStep,
  whoGotNoPoints,
  announcement,
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();

  const { correctCoordinatesPerPlayer, colorCodedCluesPerPlayer, whoGotNoPointsNames, playerCount } =
    useMemo(() => {
      return {
        correctCoordinatesPerPlayer: clues.reduce((acc: PlainObject, clue) => {
          if (clue.playerId) {
            acc[clue.coordinate] = clue.playerId;
          }
          return acc;
        }, {}),
        colorCodedCluesPerPlayer: clues.reduce((acc: StringDictionary, clue) => {
          if (clue.playerId) {
            acc[clue.playerId] = AVATARS[players[clue.playerId].avatarId].color;
          }
          return acc;
        }, {}),
        whoGotNoPointsNames: whoGotNoPoints.map((playerId) => players[playerId]),
        playerCount: Object.keys(players).length,
      };
    }, [players, clues, whoGotNoPoints]);

  const playerPerVotedCell = useMemo(() => {
    return Object.values(players).reduce((acc: Dictionary<ResultPlayerCell[]>, player) => {
      Object.entries<number>(player.guesses ?? {}).forEach(([playerId, coordinate]) => {
        if (playerId !== player.id) {
          if (acc[coordinate] === undefined) {
            acc[coordinate] = [];
          }
          acc[coordinate].push({
            playerId: player.id,
            color: colorCodedCluesPerPlayer[playerId],
            isCorrect: correctCoordinatesPerPlayer[coordinate] === playerId,
          });
        }
      });

      return acc;
    }, {});
  }, [players, correctCoordinatesPerPlayer, colorCodedCluesPerPlayer]);

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Resultado" en="Results" />
      </StepTitle>

      <PopoverRule content={<ScoringRule playerCount={playerCount} />} />

      {Boolean(whoGotNoPoints.length) && (
        <RuleInstruction type="alert">
          <Translate
            pt={
              <>
                Ninguém acertou a(s) dica(s) dadas por
                <BadCluesPlayersList badCluesPlayersList={whoGotNoPointsNames} />, então ele(s) perde(m){' '}
                <PointsHighlight type="negative">- {playerCount}</PointsHighlight> pontos.
              </>
            }
            en={
              <>
                Nobody got the clues given by
                <BadCluesPlayersList badCluesPlayersList={whoGotNoPointsNames} />, so they lose{' '}
                <PointsHighlight type="negative">- {playerCount}</PointsHighlight> points.
              </>
            }
          />
        </RuleInstruction>
      )}

      <WordGrid
        grid={grid}
        gridType={gridType}
        user={user}
        CellComponent={ResultCell}
        cellComponentProps={{
          clues,
          players,
          playerPerVotedCell,
          colorCodedCluesPerPlayer,
        }}
      />

      <SpaceContainer align="center">
        <TimedButton
          duration={getMeanDuration(playerCount, 6, 40, 15) + 5}
          icon={<TrophyOutlined />}
          onExpire={goToNextStep}
          onClick={goToNextStep}
        >
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </SpaceContainer>

      <TitledContainer title={<Translate pt="Todas as respostas" en="All Answers" />}>
        <AnswersTable
          correctCoordinatesPerPlayer={correctCoordinatesPerPlayer}
          players={players}
          grid={grid}
        />
      </TitledContainer>
    </Step>
  );
}
