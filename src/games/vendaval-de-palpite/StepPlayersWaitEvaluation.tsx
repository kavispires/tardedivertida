// Ant Design Resources
import { Alert } from 'antd';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Board } from './components/Board';
import { CategoryCard } from './components/CategoryCard';
import { Avatar, AvatarName } from 'components/avatars';

type StepPlayersWaitEvaluationProps = {
  categories: string[];
  board: VBoard;
  finalAnswersLeft: number;
  players: GamePlayers;
  master: GamePlayer;
};

export function StepPlayersWaitEvaluation({
  categories,
  board,
  finalAnswersLeft,
  master,
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
              Veja as pistas escrita por outros jogadores e aguarde enquanto <AvatarName player={master} /> as
              avalia.
            </>
          }
          en={
            <>
              Check the clues written by other players while <AvatarName player={master} /> is evaluating
              them.
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
              pt={<>O grupo usou até agora {finalAnswersLeft}/3 chances de respostas finais</>}
              en={<>The group has used so far {finalAnswersLeft}/3 chances of final answers</>}
            />
          </>
        }
      />

      <Board board={board} players={players} />
    </Step>
  );
}
