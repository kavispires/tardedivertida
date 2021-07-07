import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, message, Space } from 'antd';
import { CloudUploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLoading } from '../../../hooks';
// Utils
import { deepCopy } from '../../../utils';
// Components
import { AdminOnlyButton, Instruction, Step, Title } from '../../shared';
import { UeSoIssoCard as Card } from '../../cards';
import { AvatarName } from '../../avatars';
import { messageContent } from '../../modals/messageContent';
import SuggestionCard from './SuggestionCard';

function CompareSuggestionsStep({
  isUserTheNextGuesser,
  nextGuesser,
  onValidateSuggestions,
  players,
  secretWord,
  suggestions,
}) {
  const [isLoading] = useLoading();
  const [myRecommendation, setMyRecommendation] = useState(deepCopy(suggestions));
  const [isAdmin] = useGlobalState('isAdmin');

  const onSetValidation = (index, suggestionEntry, notAllowed) => {
    if (notAllowed) return;

    setMyRecommendation((arr) => {
      const newArr = [...arr];
      if (newArr[index]) {
        newArr[index].invalid = !newArr[index].invalid;
      } else {
        newArr[index] = {
          ...suggestionEntry,
          invalid: true,
        };
      }
      return newArr;
    });
  };

  useEffect(() => {
    if (isUserTheNextGuesser) {
      message.info(
        messageContent(
          'Você controla!',
          'Clique nas cartas para desclassificá-las, então, pressione "Confirmar Dicas Válidas"',
          nextGuesser.name
        )
      );
    }
  }, [isUserTheNextGuesser, nextGuesser.name]);

  const suggestionsValues = Object.values(myRecommendation);

  return (
    <Step>
      <Title white>Comparem as sugestões</Title>
      <Card word={secretWord.text} header="Palavra Secreta" />
      <Instruction contained>
        Já eliminamos todas as palavras iguais, agora, elimine palavras inválidas ou similares.
        <br />
        Lembre-se que são consideradas dicas iguais palavras derividadas, conjugações:{' '}
        <code>piloto = pilotar = pilotando</code>. Variações como pluralidade, gênero e erros ortográficos
        também devem ser eliminadas: <code>príncipe = princesa = principes = pryncip</code>.
        <br />
        <ExclamationCircleOutlined /> Para não virar bagunça, somente{' '}
        <AvatarName player={nextGuesser} addressUser />
        pode clicar nas palavras para eliminá-las ou ativá-las, mas todos podem discutir. Uma dica ser muito
        ruim não significa que ela seja inválida.
        <br /> Refiram às palavras por letra, o Adivinhador pode estar ouvindo!
      </Instruction>

      <Space className="u-word-compare-suggestions-step__suggestions">
        {suggestions.map((suggestionEntry, index) => {
          if (!isUserTheNextGuesser && !isAdmin) {
            return (
              <div key={`${suggestionEntry.suggestion}-${index}`}>
                <SuggestionCard
                  suggestion={suggestionEntry.suggestion}
                  invalid={suggestionEntry.invalid}
                  avatarId={players[suggestionEntry.playerName].avatarId}
                  index={index}
                />
              </div>
            );
          }

          return (
            <button
              key={`${suggestionEntry.suggestion}-${index}`}
              className="u-word-compare-suggestions-step__suggestion-button"
              onClick={() => onSetValidation(index, suggestionEntry, suggestionEntry.invalid)}
            >
              <SuggestionCard
                suggestion={suggestionEntry.suggestion}
                invalid={myRecommendation?.[index]?.invalid ?? suggestionEntry.invalid}
                avatarId={players[suggestionEntry.playerName].avatarId}
                index={index}
              />
            </button>
          );
        })}
      </Space>

      {isUserTheNextGuesser && (
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
            Confirmar dicas válidas
          </Button>
        </Space>
      )}

      <AdminOnlyButton
        action={() =>
          onValidateSuggestions({
            validSuggestions: suggestionsValues.filter((suggestion) => !suggestion.invalid),
          })
        }
        label="Confirmar dicas válidas como Admin"
      />
    </Step>
  );
}

CompareSuggestionsStep.propTypes = {
  isUserTheNextGuesser: PropTypes.bool,
  nextGuesser: PropTypes.shape({
    avatarId: PropTypes.number,
    name: PropTypes.string,
  }),
  onValidateSuggestions: PropTypes.func,
  players: PropTypes.object,
  secretWord: PropTypes.shape({ text: PropTypes.string }),
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      suggestion: PropTypes.string,
      invalid: PropTypes.bool,
      playerName: PropTypes.string,
    })
  ),
};

export default CompareSuggestionsStep;
