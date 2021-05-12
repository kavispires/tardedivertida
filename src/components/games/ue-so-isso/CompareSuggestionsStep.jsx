import React, { useState } from 'react';
// Design Resources
import { Button, Space } from 'antd';
import { CloudUploadOutlined, ExclamationCircleOutlined, FireFilled } from '@ant-design/icons';
// State
import { useGlobalState } from '../../../hooks';
// Components
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import AdminOnly from '../../shared/AdminOnly';
import Card from '../../cards/UeSoIssoCard';
import SuggestionCard from './SuggestionCard';

function CompareSuggestionsStep({
  nextGuesser,
  me,
  secretWord,
  suggestions,
  onValidateSuggestions,
  players,
}) {
  const [myRecommendation, setMyRecommendation] = useState(suggestions);
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

  const suggestionsValues = Object.values(myRecommendation);
  const amITheNextGuesser = nextGuesser === me;

  return (
    <div className="u-word-compare-suggestions-step">
      <Title white>Comparem as sugestões</Title>
      <Card word={secretWord.text} header="Palavra Secreta" />
      <Instruction contained>
        Já eliminamos todas as palavras iguais, agora, elimine palavras inválidas ou similares.
        <br />
        Lembre-se que são consideradas dicas iguais palavras derividadas, conjugações: piloto = pilotar =
        pilotando. Variações como pluralidade, gênero e erros ortograficos também devem ser
        eliminadas: príncipe = princesa = principes = pryncip.
        <br />
        <ExclamationCircleOutlined /> Para não virar bagunça, somente{' '}
        <strong>
          <u>{nextGuesser}</u>
        </strong>{' '}
        pode clicar nas palavras para eliminá-las ou ativá-las, mas todos podem discutir. <br /> Refiram às
        palavras por número, o Adivinhador pode estar ouvindo!
      </Instruction>

      <Space className="u-word-compare-suggestions-step__suggestions">
        {suggestions.map((suggestionEntry, index) => {
          if (!amITheNextGuesser && !isAdmin) {
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

      {amITheNextGuesser && (
        <Space className="u-word-compare-suggestions-step__submit">
          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => onValidateSuggestions(suggestionsValues)}
            disabled={false}
          >
            Confirmar dicas válidas
          </Button>
        </Space>
      )}

      <AdminOnly>
        <Button
          icon={<FireFilled />}
          type="primary"
          danger
          onClick={() => onValidateSuggestions(suggestionsValues)}
          disabled={false}
        >
          Confirmar dicas válidas como Admin
        </Button>
      </AdminOnly>
    </div>
  );
}

export default CompareSuggestionsStep;
