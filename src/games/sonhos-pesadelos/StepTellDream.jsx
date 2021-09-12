import React, { useState } from 'react';
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

function StepTellDream({ players, theme, user, table, onSubmitDream, dreamsCount }) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const [localClues, setLocalClues] = useState({});

  const onSubmitDreams = () => {
    onSubmitDream({
      action: 'SUBMIT_DREAMS',
      dreams: localClues,
    });
  };

  const hasClues =
    Object.keys(localClues).length === dreamsCount &&
    Object.values(localClues).every((e) => Boolean(e.trim()));

  return (
    <div className="s-tell-dream-step">
      <Title center>
        <Card header={translate('Tema', 'Theme', language)} className="s-theme-card" randomColor>
          {theme}
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

      <DreamBoardWrite user={user} table={table} localClues={localClues} setLocalClues={setLocalClues} />

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
