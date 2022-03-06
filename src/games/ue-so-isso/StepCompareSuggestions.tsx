import { useEffect, useState } from 'react';
// Ant Design Resources
import { Button, message, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLanguage, useLoading } from 'hooks';
// Utils
import { deepCopy } from 'utils/helpers';
// Components
import { AdminOnlyButton, Step, Title, Translate, PopoverRule, messageContent } from 'components';
import { UeSoIssoCard as Card } from './UeSoIssoCard';
import { SuggestionCard } from './SuggestionCard';
import { ComparisonDetailedRules, ComparisonPhaseRules } from './RulesBlobs';

type StepCompareSuggestionsProps = {
  isUserTheController: boolean;
  controller: GamePlayer;
  onValidateSuggestions: GenericFunction;
  onUpdateSuggestions: GenericFunction;
  players: GamePlayers;
  secretWord: UeSoIssoCard;
  suggestions: UseSoIssoSuggestion[];
};

export function StepCompareSuggestions({
  isUserTheController,
  controller,
  onValidateSuggestions,
  onUpdateSuggestions,
  players,
  secretWord,
  suggestions,
}: StepCompareSuggestionsProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [myRecommendation, setMyRecommendation] = useState<UseSoIssoSuggestion[]>(deepCopy(suggestions));
  const [isAdmin] = useGlobalState('isAdmin');
  const [wasMessageShown, setWasMessageShown] = useState(false);

  const onSetValidation = (index: number, suggestionEntry: UseSoIssoSuggestion, notAllowed?: boolean) => {
    if (notAllowed) return;

    const newRecommendation = [...myRecommendation];
    if (newRecommendation[index]) {
      newRecommendation[index].invalid = !newRecommendation[index].invalid;
    } else {
      newRecommendation[index] = {
        ...suggestionEntry,
        invalid: true,
      };
    }

    onUpdateSuggestions({ suggestions: newRecommendation });
    setMyRecommendation(newRecommendation);
  };

  useEffect(() => {
    if (isUserTheController && !wasMessageShown && !isLoading) {
      message.info(
        messageContent(
          translate('Você controla!', 'You control!'),
          translate('Siga as instruções na página', 'Follow the instructions on the page'),
          controller.id,
          3
        )
      );
      setWasMessageShown(true);
    }
  }, [isUserTheController, controller.id, translate, wasMessageShown, isLoading]);

  const suggestionsValues = Object.values(myRecommendation);

  return (
    <Step>
      <Title white>
        <Translate pt="Comparem as Dicas" en="Compare Clues" />
      </Title>

      <Card word={secretWord.text} />

      <PopoverRule content={<ComparisonDetailedRules />} showLabel />

      <ComparisonPhaseRules controller={controller} />

      <Space className="u-word-compare-suggestions-step__suggestions">
        {suggestions.map((suggestionEntry, index) => {
          if (!isUserTheController && !isAdmin) {
            return (
              <div key={`${suggestionEntry.suggestion}-${index}`}>
                <SuggestionCard
                  suggestion={suggestionEntry.suggestion}
                  invalid={suggestionEntry.invalid}
                  playerName={players[suggestionEntry.playerId].name}
                  avatarId={players[suggestionEntry.playerId].avatarId}
                  index={index}
                />
              </div>
            );
          }

          return (
            <button
              key={`${suggestionEntry.suggestion}-${index}`}
              className="u-word-compare-suggestions-step__suggestion-button"
              onClick={() => onSetValidation(index, suggestionEntry)}
              disabled={isLoading}
            >
              <SuggestionCard
                suggestion={suggestionEntry.suggestion}
                invalid={myRecommendation?.[index]?.invalid}
                avatarId={players[suggestionEntry.playerId].avatarId}
                playerName={players[suggestionEntry.playerId].name}
                index={index}
              />
            </button>
          );
        })}
      </Space>

      {isUserTheController && (
        <Space className="u-word-compare-suggestions-step__submit">
          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() =>
              onValidateSuggestions({
                validSuggestions: suggestionsValues.filter((suggestion) => !suggestion.invalid),
              })
            }
            disabled={isLoading}
          >
            <Translate pt="Confirmar dicas válidas" en="Confirm valid clues" />
          </Button>
        </Space>
      )}

      <AdminOnlyButton
        action={() =>
          onValidateSuggestions({
            validSuggestions: suggestionsValues.filter((suggestion) => !suggestion.invalid),
          })
        }
        label={translate('Confirmar dicas válidas como Admin', 'Confirm valid clues as Admin')}
      />
    </Step>
  );
}
