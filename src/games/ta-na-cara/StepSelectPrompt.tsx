import { useState } from 'react';
// Ant Design Resources
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Popover, Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { SubmitPromptPayload } from './utils/types';
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionHistory } from './components/QuestionHistory';

type StepSelectPromptProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  characters: SuspectCard[];
  questionsHistory: TestimonyQuestionCard[];
  onSubmitPrompt: (payload: SubmitPromptPayload) => void;
  onTriggerGuessing: () => void;
  activePlayerId: UID;
} & Pick<StepProps, 'announcement'>;

export function StepSelectPrompt({
  players,
  user,
  announcement,
  turnOrder,
  characters,
  questionsHistory,
  onSubmitPrompt,
  onTriggerGuessing,
  activePlayerId,
}: StepSelectPromptProps) {
  const [typedQuestion, setTypedQuestion] = useState('');
  const { translate } = useLanguage();

  // DEV: Auto decision
  useMock(() => {
    // mockPromptDecision(user, players, onSubmitPrompt, onSubmitTarget);
  });

  const suggestedQuestions = user.suggestedQuestions || [];

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Pergunta</>}
          en={<>Question</>}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          en={
            <>
              Write a vibe question that will help you identify your opponents' characters.
              <br />
              For example: "Would they be a good villain in a horror movie?", "Do they know how to whistle?"
              <br />
              Your question cannot be about their character's physical traits, but about their vibe or
              personality.
            </>
          }
          pt={
            <>
              Escreva uma pergunta de vibe que te ajude a identificar os personagens dos seus oponentes.
              <br />
              Por exemplo: "Eles seriam um bom vilão em um filme de terror?", "Eles sabem assobiar?"
              <br />
              Sua pergunta não pode ser sobre traços físicos do personagem, mas sobre a vibe ou personalidade
              dele.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer size="large">
        <Space.Compact>
          <Input
            size="large"
            style={{ minWidth: 200, width: '30vw', maxWidth: 384 }}
            value={typedQuestion}
            onChange={(e) => setTypedQuestion(e.target.value)}
            placeholder={translate({
              pt: 'Escreva sua pergunta de vibe aqui...',
              en: 'Write your vibe question here...',
            })}
          />
          <SendButton
            size="large"
            disabled={typedQuestion.trim().length < 5}
            onClick={() => onSubmitPrompt({ question: typedQuestion })}
          >
            <Translate
              pt="Enviar"
              en="Send"
            />
          </SendButton>
        </Space.Compact>

        <Popover
          title={
            <Translate
              pt="Está sem criatividade? Selecione uma dessas sugestões:"
              en="Out of ideas? Select one of these suggestions:"
            />
          }
          content={
            <Flex
              vertical
              gap={8}
              style={{ maxWidth: 480 }}
            >
              {suggestedQuestions.map((suggestedQuestion: TestimonyQuestionCard) => (
                <Button
                  key={suggestedQuestion.id}
                  style={{
                    whiteSpace: 'normal',
                  }}
                  onClick={() => onSubmitPrompt({ questionId: suggestedQuestion.id })}
                >
                  {suggestedQuestion.question}
                </Button>
              ))}
            </Flex>
          }
          trigger="click"
        >
          <Button
            size="large"
            icon={<QuestionCircleOutlined />}
          />
        </Popover>

        {questionsHistory.length > 1 && (
          <Popconfirm
            title={
              <Translate
                en="Are you sure you want to guess?"
                pt="Tem certeza que deseja tentar adivinhar?"
              />
            }
            description={
              <Translate
                en={
                  <>
                    All players will be given a chance to make their guess.
                    <br />
                    The game will end after this round.
                  </>
                }
                pt={
                  <>
                    Todos os jogadores terão a chance de fazer sua adivinhação.
                    <br />O jogo terminará após esta rodada.
                  </>
                }
              />
            }
            onConfirm={onTriggerGuessing}
          >
            <Button size="large">
              <Translate
                pt="Adivinhar"
                en="Guess"
              />
            </Button>
          </Popconfirm>
        )}
      </SpaceContainer>

      <SpaceContainer>
        <CharactersBoard
          characters={characters}
          players={players}
          user={user}
        />
        <QuestionHistory
          players={players}
          questionsHistory={questionsHistory}
        />
      </SpaceContainer>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayerId}
      />
    </Step>
  );
}
