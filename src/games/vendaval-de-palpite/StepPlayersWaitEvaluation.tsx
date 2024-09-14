// Ant Design Resources
import { Alert } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Components
import { Avatar, AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
// Internal
import type { Clues, BoardObject } from './utils/types';
import { Board } from './components/Board';
import { CategoryCard } from './components/CategoryCard';
// Types

type StepPlayersWaitEvaluationProps = {
  categories: string[];
  board: BoardObject;
  clues: Clues;
  finalAnswersLeft: number;
  players: GamePlayers;
  boss: GamePlayer;
};

export function StepPlayersWaitEvaluation({
  categories,
  board,
  clues,
  finalAnswersLeft,
  boss,
  players,
}: StepPlayersWaitEvaluationProps) {
  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Avaliação" en="Avaliação" />
      </Title>

      <CategoryCard categories={categories} />

      <Instruction contained>
        <Translate
          pt={
            <>
              Veja as pistas escrita por outros jogadores e aguarde enquanto <AvatarName player={boss} /> as
              avalia.
            </>
          }
          en={
            <>
              Check the clues written by other players while <AvatarName player={boss} /> is evaluating them.
            </>
          }
        />
      </Instruction>

      <Alert
        type="warning"
        showIcon
        message={
          <>
            <Avatar id="A" size="small" />
            <Translate
              pt={<>O grupo usou até agora {3 - finalAnswersLeft}/3 chances de respostas finais</>}
              en={<>The group has used so far {3 - finalAnswersLeft}/3 chances of final answers</>}
            />
          </>
        }
      />

      <Board board={board} clues={clues} players={players} />
    </Step>
  );
}
