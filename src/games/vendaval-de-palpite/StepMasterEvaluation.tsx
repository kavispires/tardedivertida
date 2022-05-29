import { useState } from 'react';
// Ant Design Resources
import { Alert, Button, Divider, InputNumber, Space } from 'antd';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';
import { Avatar } from 'components/avatars';

type StepMasterEvaluationProps = {
  secretWord: string;
  categories: string[];
  onSubmitEvaluation: Function;
  onSubmitOutcome: Function;
  onSubmitHelp: Function;
  board: VBoard;
  finalAnswersLeft: number;
  players: GamePlayers;
  round: GameRound;
  outcome?: string;
};

export function StepMasterEvaluation({
  secretWord,
  categories,
  onSubmitEvaluation,
  onSubmitOutcome,
  onSubmitHelp,
  board,
  finalAnswersLeft,
  players,
  round,
  outcome,
}: StepMasterEvaluationProps) {
  const [correctCount, setCorrectCount] = useState(0);
  const latestBoardEntry = board[round.current];

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Avaliação" en="Avaliação" />
      </Title>

      <CategoryWordGroup categories={categories} secretWord={secretWord} showSecretWord />

      <Board board={board} players={players} />

      <Instruction contained>
        <Translate
          pt={
            <>
              Selecione quantas da última remessa de dicas estão corretas.
              <br /> Você pode fazer perguntar para clarificar o que os jogadores quiseram dizer.
            </>
          }
          en={
            <>
              Write clues that will have narrow down the possibilities. You can ask clarifying questions about
              any of them.
            </>
          }
        />
      </Instruction>

      <Space>
        <InputNumber
          min={0}
          max={latestBoardEntry.clues.length}
          defaultValue={0}
          onChange={setCorrectCount}
        />
        <Button type="primary" onClick={() => onSubmitEvaluation({ evaluation: correctCount })}>
          <Translate
            pt={`Enviar que ${correctCount} estão corretas`}
            en={`Submit that ${correctCount} are correct`}
          />
        </Button>
      </Space>

      <Divider />

      <Instruction contained>
        {outcome && outcome !== 'CONTINUE' ? (
          <Alert
            type="warning"
            showIcon
            message={
              <>
                <Avatar id="A" size="small" />
                <Translate
                  pt="Meu algorítimo me diz que um dos casos abaixo aconteceu, selecione o apropriado:"
                  en="According to my calculations, one of the cases below happened, select the appropriate case:"
                />
              </>
            }
          />
        ) : (
          <Translate
            pt="Se qualquer um dos casos abaixo acontecer, clique no botão apropriado"
            en="If any of the cases below trigger, click the appropriate button"
          />
        )}
      </Instruction>

      <div className="v-case-container">
        <div className="v-case">
          <Instruction contained>
            <Translate
              pt="Alguém escreveu a resposta numa carta VERMELHA"
              en="Someone wrote the answer in a RED card"
            />
          </Instruction>
          <Button
            type="primary"
            ghost
            onClick={() =>
              onSubmitOutcome({
                outcome: 'WIN',
              })
            }
          >
            <Translate pt="Ganhamos!" en="Win!" />
          </Button>
        </div>
        <div className="v-case">
          <Instruction contained>
            <Translate
              pt="Alguém escreveu a resposta numa carta BRANCA"
              en="Someone wrote the answer in a WHITE card"
            />
          </Instruction>
          <Button
            danger
            ghost
            onClick={() =>
              onSubmitOutcome({
                outcome: 'FAIL',
              })
            }
          >
            <Translate pt="Perdermos" en="Lose" />
          </Button>
        </div>
        <div className="v-case">
          <Instruction contained>
            <Translate
              pt="Jogadores usaram mais respostas do que tinham"
              en="Players wrote more Guesses than they had available"
            />{' '}
            ({finalAnswersLeft})
          </Instruction>
          <Button
            type="primary"
            danger
            ghost
            onClick={() =>
              onSubmitOutcome({
                outcome: 'FAIL',
              })
            }
            disabled={finalAnswersLeft >= 0}
          >
            <Translate pt="Perdermos" en="Lose" />
          </Button>
        </div>
      </div>
    </Step>
  );
}
