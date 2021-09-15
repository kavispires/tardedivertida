import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Components
import {
  ButtonContainer,
  Instruction,
  ReadyPlayersBar,
  Title,
  translate,
  Translate,
} from '../../components/shared';
import AllClues from './AllClues';
import { getEntryId, hasDuplicates, isDevEnv, shuffle } from '../../utils';
import { LETTERS, SEPARATOR } from '../../utils/constants';
import DreamBoardVote from './DreamBoardVote';

function StepMatchDreams({ players, theme, user, table, onSubmitDream, clues }) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const [votes, setVotes] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [isDoneVoting, setIsDoneVoting] = useState(false);

  useEffect(() => {
    setIsDoneVoting(Object.keys(votes).length === clues.length && !hasDuplicates(Object.values(votes)));
  }, [votes, clues]);

  // Auto-select own clues
  useEffect(() => {
    const userClues = clues.reduce((acc, entry, index) => {
      if (entry.playerId === user.id) {
        const clueEntryId = getEntryId(['clue', entry.cardId, LETTERS[index]]);
        const cardEntryId = getEntryId(['card', entry.cardId]);
        acc[clueEntryId] = cardEntryId;
      }
      return acc;
    }, {});
    if (userClues) {
      setVotes((s) => ({ ...s, ...userClues }));
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
      setVotes((s) => ({ ...s, ...devRes }));
    }
  };

  const onSubmitDreams = () => {
    onSubmitDream({
      action: 'SUBMIT_VOTING',
      votes,
    });
  };

  const onActivateItem = useCallback(
    (entryId) => {
      if (entryId === activeItem) {
        return setActiveItem(null);
      }

      const [type] = entryId.split(SEPARATOR);
      if (!activeItem || activeItem.startsWith(type)) {
        setActiveItem(entryId);
      } else {
        if (type === 'card') {
          setVotes((prevVotes) => {
            return {
              ...prevVotes,
              [activeItem]: entryId,
            };
          });
        } else {
          setVotes((prevVotes) => {
            return {
              ...prevVotes,
              [entryId]: activeItem,
            };
          });
        }
        setActiveItem(null);
      }
    },
    [activeItem]
  );

  return (
    <div className="s-tell-dream-step">
      <Title>{translate('Adivinhação', 'Match the Pairs', language)}</Title>
      <Instruction contained>
        <Translate
          pt="Clique em uma dica e então uma botão da imagem correspondente ou vice e versa. Aperte enviar quando terminar te combinar todas as dicas"
          en="Click on a clue then on an image button or vice versa. When you're done matching all clues, press Submit"
        />
      </Instruction>

      <ButtonContainer>
        <Button type="primary" disabled={isLoading || !isDoneVoting} onClick={onSubmitDreams}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
        {isDevEnv && <Button onClick={devRandomVoting}>Dev Random Vote</Button>}
      </ButtonContainer>

      <AllClues
        clues={clues}
        activeItem={activeItem}
        onActivateItem={onActivateItem}
        votes={votes}
        players={players}
      />

      <DreamBoardVote
        user={user}
        table={table}
        activeItem={activeItem}
        onActivateItem={onActivateItem}
        votes={votes}
        players={players}
      />

      <ReadyPlayersBar players={players} />
    </div>
  );
}

StepMatchDreams.propTypes = {
  dreamsCount: PropTypes.number,
  onSubmitDream: PropTypes.func,
  players: PropTypes.object,
  table: PropTypes.array,
  theme: PropTypes.string,
  user: PropTypes.object,
};

export default StepMatchDreams;
