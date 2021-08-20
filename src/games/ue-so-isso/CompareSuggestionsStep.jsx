import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, message, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLoading } from '../../hooks';
// Utils
import { deepCopy } from '../../utils';
// Components
import { AdminOnlyButton } from '../../components/admin/index';
import { Step, Title, Translate } from '../../components/shared';
import { UeSoIssoCard as Card } from '../../components/cards';
import { messageContent } from '../../components/modals/messageContent';
import SuggestionCard from './SuggestionCard';
import { ComparisonDetailedRules, ComparisonPhaseRules } from './RulesBlobs';
import { CollapsibleRule } from '../../components/rules';

function CompareSuggestionsStep({
  isUserTheController,
  controller,
  onValidateSuggestions,
  onUpdateSuggestions,
  players,
  secretWord,
  suggestions,
}) {
  const [isLoading] = useLoading();
  const [myRecommendation, setMyRecommendation] = useState(deepCopy(suggestions));
  const [isAdmin] = useGlobalState('isAdmin');

  const onSetValidation = (index, suggestionEntry, notAllowed) => {
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
    if (isUserTheController) {
      message.info(
        messageContent(
          <Translate pt="Você controla!" en="You control!" string />,
          <Translate pt="Siga as instruções na página" en="Follow the instructions on the page" string />,
          controller.id,
          3
        )
      );
    }
  }, [isUserTheController, controller.id]);

  const suggestionsValues = Object.values(myRecommendation);

  return (
    <Step>
      <Title white>
        <Translate pt="Comparem as Dicas" en="Compare Clues" />
      </Title>

      <Card word={secretWord.text} />

      <CollapsibleRule>
        <ComparisonDetailedRules />
      </CollapsibleRule>
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
        label={<Translate pt="Confirmar dicas válidas como Admin" en="Confirm valid clues as Admin" string />}
      />
    </Step>
  );
}

CompareSuggestionsStep.propTypes = {
  controller: PropTypes.shape({
    avatarId: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  isUserTheController: PropTypes.bool,
  onUpdateSuggestions: PropTypes.func,
  onValidateSuggestions: PropTypes.func,
  players: PropTypes.object,
  secretWord: PropTypes.shape({
    text: PropTypes.string,
  }),
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      suggestion: PropTypes.string,
      invalid: PropTypes.bool,
      playerId: PropTypes.string,
    })
  ),
};

export default CompareSuggestionsStep;
