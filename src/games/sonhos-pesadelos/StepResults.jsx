import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Alert } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Utils
import { LETTERS, SEPARATOR } from '../../utils/constants';
// Components
import { Instruction, Title, translate, Translate } from '../../components/shared';
import { AdminForceNextPhase } from '../../components/admin';
import DreamBoard from './DreamBoard';
import DreamCard from './DreamCard';

function StepResults({ results, user, clues, table }) {
  const language = useLanguage();
  const playerResults = results[user.id];

  const currentVotes = Object.entries(user?.votes ?? {}).reduce((acc, [clueEntryId, cardEntryId]) => {
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
                <DreamCard cardId={entry.cardId} cardWidth={80} hideBlurButton />
                <ol>
                  {entry.clue.map((clueText) => {
                    return <li key={clueText}>{clueText}</li>;
                  })}
                </ol>
              </li>
            );
          })}
        </ul>
        {Boolean(playerResults.nightmareHits.length) && (
          <Alert
            type="warning"
            showIcon
            message={translate(
              `${playerResults.nightmareHits.length} jogadores acharam que um dos seus pesadelos era a resposta. Você não pode ganhar se isso acontece.`,
              `${playerResults.nightmareHits.length} players match one of your nightmares with one of your clues. You can't win if this happens.`,
              language
            )}
          />
        )}
      </Instruction>

      <DreamBoard table={table} user={user} className="s-dream-board-results" />

      <AdminForceNextPhase buttonText={translate('Próxima Rodada', 'Go to Next Round', language)} />
    </div>
  );
}

StepResults.propTypes = {
  clues: PropTypes.any,
  results: PropTypes.any,
  user: PropTypes.shape({
    dreams: PropTypes.any,
    id: PropTypes.any,
    votes: PropTypes.any,
  }),
};

export default StepResults;
