// Ant Design Resources
import { SendOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { DevButton } from 'components/debug';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { ControlledInputWriting } from 'components/input';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { mockSuggestions } from './utils/mock';
import type { SecretWord, SubmitSuggestionsPayload } from './utils/types';
import { WritingRules } from './components/RulesBlobs';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { WritingHighlight } from './components/Highlights';

type StepSuggestionProps = {
  guesser: GamePlayer;
  isUserTheGuesser: boolean;
  onSendSuggestions: (payload: SubmitSuggestionsPayload) => void;
  secretWord: SecretWord;
  suggestionsNumber?: number;
} & Pick<StepProps, 'announcement'>;

export function StepSuggestion({
  guesser,
  onSendSuggestions,
  secretWord,
  suggestionsNumber = 1,
  announcement,
  isUserTheGuesser,
}: StepSuggestionProps) {
  useMock(() => {
    if (!isUserTheGuesser) {
      onSendSuggestions(mockSuggestions(suggestionsNumber));
    }
  }, []);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={
            <>
              Escreva uma dica para <PlayerAvatarName player={guesser} />
            </>
          }
          en={
            <>
              Write a clue for <PlayerAvatarName player={guesser} />
            </>
          }
        />
      </StepTitle>

      <WritingRules />

      <Card word={secretWord.text} />

      {suggestionsNumber > 1 && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                Já que esse jogo tem menos jogadores, você tem que escrever{' '}
                <WritingHighlight>{suggestionsNumber} sugestões</WritingHighlight>
              </>
            }
            en={
              <>
                Since we have fewer players you must write{' '}
                <WritingHighlight>{suggestionsNumber} clues</WritingHighlight>
              </>
            }
          />
        </RuleInstruction>
      )}

      <ControlledInputWriting
        onSubmit={onSendSuggestions}
        inputComponent={SuggestionEasel}
        valueKey="suggestions"
        inputQuantity={suggestionsNumber}
        submitButtonLabel={
          <>
            <Translate
              pt="Enviar dica"
              en="Send clue"
            />
            {suggestionsNumber > 1 && 's'}
          </>
        }
        submitButtonProps={{
          icon: <SendOutlined />,
          size: 'large',
        }}
      />

      <DevButton
        ghost
        onClick={() => onSendSuggestions(mockSuggestions(suggestionsNumber))}
      >
        Mock Suggestions
      </DevButton>
    </Step>
  );
}
