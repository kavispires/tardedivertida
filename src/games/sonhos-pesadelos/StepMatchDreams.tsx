import { useEffect } from 'react';
// Design Resources
import { Button } from 'antd';
// Hooks
import { useLanguage, useLoading, useVotingMatch } from '../../hooks';
// Utils
import { getEntryId, isDevEnv, shuffle } from '../../utils/helpers';
import { LETTERS } from '../../utils/constants';
// Components
import { ButtonContainer, Instruction, ReadyPlayersBar, Step, Title, Translate } from '../../components';
import { AllClues } from './AllClues';
import { DreamBoardVote } from './DreamBoardVote';

type StepMatchDreamsProps = {
  clues: SClue[];
  currentRound: number;
  dreamsCount: Number;
  onSubmitVotes: GenericFunction;
  players: GamePlayers;
  table: STable;
  user: GamePlayer;
};

export function StepMatchDreams({
  players,
  user,
  table,
  onSubmitVotes,
  clues,
  currentRound,
}: StepMatchDreamsProps) {
  const [isLoading] = useLoading();
  const { translate } = useLanguage();
  const { votes, setVotes, activeItem, activateItem, isVotingComplete } = useVotingMatch(
    'clue',
    false,
    clues.length
  );

  // Auto-select own clues
  useEffect(() => {
    const userClues = clues.reduce((acc: PlainObject, entry, index) => {
      if (entry.playerId === user.id) {
        const clueEntryId = getEntryId(['clue', entry.cardId, LETTERS[index]]);
        const cardEntryId = getEntryId(['card', entry.cardId]);
        acc[clueEntryId] = cardEntryId;
      }
      return acc;
    }, {});
    if (userClues) {
      setVotes((s: PlainObject) => ({ ...s, ...userClues }));
    }
  }, []); //eslint-disable-line

  const devRandomVoting = () => {
    const devCards = table
      .filter((entry) => entry.dreamer && entry.dreamer !== user.id)
      .map((entry) => getEntryId(['card', entry.cardId]));
    const devClues = shuffle(
      clues
        .map((entry, index) => getEntryId(['clue', entry.cardId, LETTERS[index]]))
        .filter((entryId) => !Object.keys(votes).includes(entryId))
    );

    const devRes = devClues.reduce((acc, clueEntryId, index) => {
      acc[clueEntryId] = devCards[index];
      return acc;
    }, {});

    if (devRes) {
      setVotes((s: PlainObject) => ({ ...s, ...devRes }));
    }
  };

  const onSubmitDreams = () => {
    onSubmitVotes({
      votes,
    });
  };

  return (
    <Step fullWidth className="s-tell-dream-step">
      <Title>{translate('Adivinhação', 'Match the Pairs')}</Title>
      <Instruction contained>
        <Translate
          pt="Clique em uma carta e então uma botão da imagem correspondente ou vice e versa. Aperte enviar quando terminar te combinar todas as dicas."
          en="Click on a clue then on an image button or vice versa. When you're done matching all clues, press Submit."
        />
      </Instruction>

      <ButtonContainer>
        <Button type="primary" disabled={isLoading || !isVotingComplete} onClick={onSubmitDreams}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
        {isDevEnv && <Button onClick={devRandomVoting}>Dev Random Vote</Button>}
      </ButtonContainer>

      <AllClues
        clues={clues}
        activeItem={activeItem}
        onActivateItem={activateItem}
        votes={votes}
        players={players}
        currentRound={currentRound}
      />

      <DreamBoardVote
        user={user}
        table={table}
        activeItem={activeItem}
        onActivateItem={activateItem}
        votes={votes}
      />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
