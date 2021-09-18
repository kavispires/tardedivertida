import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Components
import { Card } from '../../components/cards';
import {
  ButtonContainer,
  Instruction,
  ReadyPlayersBar,
  Title,
  translate,
  Translate,
} from '../../components/shared';
import DreamBoardWrite from './DreamBoardWrite';
import { isDevEnv, shuffle } from '../../utils';

const mockedClues = [
  'água',
  'bola',
  'calderão do huck',
  'dedo',
  'esmalte',
  'fatídico',
  'ganhar',
  'hereditário',
  'simpático',
  'abismo',
  'rola',
  'a branca de neve',
  'oops i did it again',
  'pesquisa',
  'saborosa',
  'amargo',
];

function StepTellDream({ players, theme, user, table, onSubmitDream, dreamsCount, currentRound }) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const [localClues, setLocalClues] = useState({});
  const [hasClues, setHasClues] = useState(false);

  // Verify if player has completed all his clues
  useEffect(() => {
    setHasClues(
      Object.keys(localClues).length === dreamsCount &&
        Object.values(localClues).every((e) => Boolean(e.trim()))
    );
  }, [localClues, dreamsCount]);

  useEffect(() => {
    if (isDevEnv) {
      const shuffledMockedClues = shuffle(mockedClues);
      setLocalClues(
        Object.keys(user.dreams).reduce((acc, cardId, index) => {
          acc[cardId] = shuffledMockedClues[index];
          return acc;
        }, {})
      );
    }
  }, []); // eslint-disable-line

  const onSubmitDreams = () => {
    onSubmitDream({
      action: 'SUBMIT_DREAMS',
      dreams: localClues,
    });
  };

  return (
    <div className="s-tell-dream-step">
      <Title center>
        <Card
          header={translate('Tema', 'Theme', language)}
          className="s-theme-card"
          randomColor
          footer={theme.description}
          footerClassName="s-theme-card__description"
        >
          {theme.text}
        </Card>
      </Title>
      <Instruction contained>
        <Translate
          pt="Clique nos botões amarelos para escrever sua(s) dica(s). Quando terminar, aperte Enviar"
          en="Click the yellow buttons to write your clue(s).When you're done, press Submit"
        />
      </Instruction>

      <ButtonContainer>
        <Button type="primary" disabled={isLoading || !hasClues} onClick={onSubmitDreams}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </ButtonContainer>

      <DreamBoardWrite
        user={user}
        table={table}
        localClues={localClues}
        setLocalClues={setLocalClues}
        currentRound={currentRound}
      />

      <ReadyPlayersBar players={players} />
    </div>
  );
}

StepTellDream.propTypes = {
  dreamsCount: PropTypes.number,
  onSubmitDream: PropTypes.func,
  players: PropTypes.object,
  table: PropTypes.array,
  theme: PropTypes.string,
  user: PropTypes.object,
};

export default StepTellDream;
