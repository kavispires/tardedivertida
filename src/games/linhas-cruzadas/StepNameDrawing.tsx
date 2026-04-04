import { type ChangeEvent, useState } from 'react';
// Ant Design Resources
import { Input } from 'antd';
// Types
import type { GameRound, GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { CanvasSVG } from 'components/canvas/CanvasSVG';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { Step } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { Title } from 'components/text/Title';
// Internal
import type { Prompt, SubmitGuessPayload } from './utils/types';

type StepNameDrawingProps = {
  currentPrompt: Prompt;
  onSubmitGuess: (payload: SubmitGuessPayload) => void;
  players: GamePlayers;
  // for mock
  user: GamePlayer;
  round: GameRound;
};

export function StepNameDrawing({
  currentPrompt,
  onSubmitGuess,
  players,
  user,
  round,
}: StepNameDrawingProps) {
  const { translate } = useLanguage();
  const [title, setTitle] = useState<string>('');

  const author = players[currentPrompt.author];

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const onSubmitTitle = () => onSubmitGuess({ guess: title });

  // DEV: Auto write
  useMock(() => onSubmitGuess({ guess: `${round.current}${user.id}` }), []);

  return (
    <Step>
      <Title>
        <Translate
          pt="O que é isso?"
          en="What is this?"
        />
      </Title>
      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              <PlayerAvatarName player={author} /> desenhou isso.
            </>
          }
          en={
            <>
              <PlayerAvatarName player={author} /> drew this.
            </>
          }
        />
      </RuleInstruction>

      <CanvasSVG
        drawing={currentPrompt.content}
        className="l-drawing"
        width={300}
      />

      <Input
        onChange={onTitleChange}
        size="large"
        placeholder={translate('Escreva seu chute aqui', 'Write your guess here')}
        className="l-drawing-guess-input"
        onPressEnter={onSubmitTitle}
      />

      <SpaceContainer>
        <SendButton
          onClick={onSubmitTitle}
          size="large"
          disabled={!title}
        >
          <Translate
            pt="Enviar"
            en="Submit name"
          />
        </SendButton>
      </SpaceContainer>
    </Step>
  );
}
