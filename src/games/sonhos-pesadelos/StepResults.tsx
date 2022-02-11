// Design Resources
import { Alert } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Utils
import { LETTERS, SEPARATOR } from '../../utils/constants';
// Components
import { AdminNextRoundButton, Instruction, Step, Title, Translate } from '../../components';
import { DreamBoard } from './DreamBoard';
import { DreamCard } from './DreamCard';

type StepResultsProps = {
  results: SResults;
  user: GamePlayer;
  clues: SClue[];
  table: STable;
  round: GameRound;
};
export function StepResults({ results, user, clues, table, round }: StepResultsProps) {
  const { translate } = useLanguage();
  const playerResults = results[user.id];

  const currentVotes = Object.entries<PlainObject>(user?.votes ?? {}).reduce(
    (acc: PlainObject[], [clueEntryId, cardEntryId]) => {
      const cardId = cardEntryId.split(SEPARATOR)[1];
      if (Boolean(user.dreams[cardId])) return acc;

      const letter = clueEntryId.split(SEPARATOR)[2];
      acc.push({
        cardId,
        clue: clues[LETTERS.indexOf(letter)].clue,
      });

      return acc;
    },
    []
  );

  return (
    <Step fullWidth className="s-results-step">
      <Title>{translate('Resultado', 'Results')}</Title>
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
                <ul className="s-results-clues">
                  {entry.clue.map((clueText: string, index: number) => {
                    return (
                      <>
                        {index === 1 && (
                          <li key={`label-${index}`} className="s-results-clues-label">
                            <Translate pt="Dicas no mesmo grupo:" en="Clues on the same group:" />
                          </li>
                        )}
                        <li key={clueText} className="s-results-clues-item">
                          {clueText}
                        </li>
                      </>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        {Boolean(playerResults.nightmareHits.length) && (
          <Alert
            type="warning"
            showIcon
            message={translate(
              `Seus pesadelos foram selecionados ${playerResults.nightmareHits.length} veze(s) por um ou mais jogadores achando que eles eram seus sonhos. Você não pode ganhar nessa rodada quando isso acontece.`,
              `You dreams were selected ${playerResults.nightmareHits.length} time(s) by one or more players thinking they match one of your clues. You can't win this round when this happens.`
            )}
          />
        )}
      </Instruction>

      <DreamBoard table={table} user={user} className="s-dream-board-results" />

      <AdminNextRoundButton round={round} />
    </Step>
  );
}
