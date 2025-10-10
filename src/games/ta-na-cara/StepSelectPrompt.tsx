import { useState } from 'react';
// Ant Design Resources
import { Radio } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import type { PhasePromptingState, SubmitPromptPayload } from './utils/types';
import { Prompt } from './components/Prompt';
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionsHighlight } from './components/Highlights';
// Hooks

type StepSelectPromptProps = {
  players: GamePlayers;
  user: GamePlayer;
  onSubmitPrompt: (payload: SubmitPromptPayload) => void;
} & Pick<
  PhasePromptingState,
  'turnOrder' | 'grid' | 'identitiesDict' | 'turnQuestions' | 'vibesMode' | 'questionCount'
> &
  Pick<StepProps, 'announcement'>;

export function StepSelectPrompt({
  players,
  user,
  announcement,
  onSubmitPrompt,
  identitiesDict,
  grid,
  turnOrder,
  turnQuestions,
  vibesMode,
  questionCount,
}: StepSelectPromptProps) {
  useMock(() => {
    if (!vibesMode) {
      onSubmitPrompt({
        questionId: turnQuestions[0]?.id,
        customQuestion: '',
        customAnswer: '',
      });
    }
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="A Pergunta da Vez" en="The Question for the Turn" />
      </StepTitle>

      <ViewOr condition={vibesMode}>
        <RuleInstruction type="action">TODO</RuleInstruction>

        <QuestionSelection
          onSubmitPrompt={onSubmitPrompt}
          turnQuestions={turnQuestions}
          questionCount={questionCount}
          players={players}
        />
      </ViewOr>

      <CharactersBoard
        grid={grid}
        identitiesDict={identitiesDict}
        playerSuspectId={user?.identity?.identityId}
      />

      <TurnOrder players={players} order={turnOrder} activePlayerId={user.id} />
    </Step>
  );
}

function QuestionSelection({
  onSubmitPrompt,
  turnQuestions,
  questionCount,
  players,
}: Pick<StepSelectPromptProps, 'onSubmitPrompt' | 'turnQuestions' | 'questionCount' | 'players'>) {
  const [selectionId, setSelectionId] = useState<string | null>(null);
  const playerCount = Object.keys(players).length;

  return (
    <SpaceContainer direction="vertical">
      <RuleInstruction type="action">
        <Translate
          pt="Selecione um das perguntas abaixo que você acha que ajudará a identificar as identidades dos outros jogadores"
          en="Select one of the questions below that you think will help identify the identities of the other players"
        />
        <br />
        <Translate pt="Perguntas até a adivinhação" en="Questions until guessing" />:{' '}
        <QuestionsHighlight>
          {questionCount}/{Math.max(5, playerCount)}
        </QuestionsHighlight>
      </RuleInstruction>

      <Radio.Group
        onChange={(e) => setSelectionId(e.target.value)}
        value={selectionId}
        options={turnQuestions.map((q) => ({ label: <Prompt question={q} />, value: q.id }))}
      />

      <SendButton
        onClick={() => {
          if (selectionId) {
            onSubmitPrompt({ questionId: selectionId, customQuestion: '', customAnswer: '' });
          }
        }}
        disabled={!selectionId}
      >
        <Translate pt="Enviar Pergunta" en="Send Question" />
      </SendButton>
    </SpaceContainer>
  );
}
