import React from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { Instruction, Title, translate, Translate } from '../../components/shared';

import { LETTERS, SEPARATOR } from '../../utils/constants';
import { AdminForceNextPhase } from '../../components/admin';
import { ImageCard } from '../../components/cards';

function StepResults({ players, results, user, clues }) {
  const language = useLanguage();
  const playerResults = results[user.id];

  const currentVotes = Object.entries(user.votes).reduce((acc, [cardEntryId, clueEntryId]) => {
    const cardId = cardEntryId.split(SEPARATOR)[1];
    if (Boolean(user.dreams[cardId])) return acc;

    const letter = clueEntryId.split(SEPARATOR)[2];
    acc.push({
      cardId,
      clue: clues[LETTERS.indexOf(letter)].clue,
    });

    return acc;
  }, []);

  return (
    <div className="s-results-step">
      <Title>{translate('Resultado', 'Results', language)}</Title>
      <Instruction contained>
        <div className="s-result-correct">{playerResults.correct}</div>
        <div>
          <Translate pt="pares corretos" en="correct pairs" />
        </div>
        <ul className="s-results-current-votes">
          {currentVotes.map((entry) => {
            return (
              <li key={`current-votes-${entry.cardId}`} className="s-results-current-vote">
                <ImageCard imageId={entry.cardId} bordered cardWidth={80} className="" />
                <ol>
                  {entry.clue.map((clueText) => {
                    return <li key={clueText}>{clueText}</li>;
                  })}
                </ol>
              </li>
            );
          })}
        </ul>
      </Instruction>

      <Instruction contained>
        <p>
          <Translate
            pt={`${playerResults.nightmareHits.length} jogadores acharam que um dos seus pesadelos era a resposta.`}
            en={`${playerResults.nightmareHits.length} players match one of your nightmares with one of your clues.`}
          />
        </p>
        <p>TODO: Mostrar resultados?</p>
      </Instruction>

      <AdminForceNextPhase buttonText={translate('Próxima Rodada', 'Go to Next Round', language)} />
    </div>
  );
}

StepResults.propTypes = {};

export default StepResults;
