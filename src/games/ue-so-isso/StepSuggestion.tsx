// Ant Design Resources
import { CloudUploadOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { mockSuggestions } from './utils/mock';
// Components
import { WritingRules } from './components/RulesBlobs';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ControlledInputWriting } from 'components/input';
import { DevButton } from 'components/debug';
import { WritingHighlight } from './components/Highlights';
import { SuggestionEasel } from 'components/game/SuggestionEasel';

type StepSuggestionProps = {
  guesser: GamePlayer;
  isUserTheGuesser: boolean;
  onSendSuggestions: GenericFunction;
  secretWord: TextCard;
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
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Escreva uma dica para <AvatarName player={guesser} />
            </>
          }
          en={
            <>
              Write a clue for <AvatarName player={guesser} />
            </>
          }
        />
      </Title>

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
            <Translate pt="Enviar dica" en="Send clue" />
            {suggestionsNumber > 1 && 's'}
          </>
        }
        submitButtonProps={{
          icon: <CloudUploadOutlined />,
          size: 'large',
        }}
      />

      <DevButton ghost onClick={() => onSendSuggestions(mockSuggestions(suggestionsNumber))}>
        Mock Suggestions
      </DevButton>
    </Step>
  );
}
