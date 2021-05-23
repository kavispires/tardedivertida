import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Slider } from 'antd';
// Components
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import Dial from './Dial';
import AvatarName from '../../avatars/AvatarName';

function DialGuessSelection({
  activeTeam,
  teamController,
  amITheController,
  isMyTeamActive,
  onSendGuess,
  card,
  amIThePsychic,
}) {
  const [needle, setNeedle] = useState(0);

  return (
    <div className="o-dial-guess-selection">
      <Title>
        {amIThePsychic ? (
          <span>Seu time está pensando...</span>
        ) : (
          <span>Hora do time {activeTeam} brilhar!</span>
        )}
      </Title>
      <Instruction contained>
        Qual número melhor indica <span className="o-dial-guess-selection__clue">{card.clue}</span> na escala
        de{' '}
        <strong>
          {card.left}-{card.right}
        </strong>
        ?
      </Instruction>

      <Dial card={card} showTarget={false} target={card.target} showNeedle={isMyTeamActive} needle={needle} />

      {isMyTeamActive ? (
        <Instruction contained>
          {amIThePsychic ? (
            <span>Pokerface e bico fechada! Mas pode brincar com a barrra aí!</span>
          ) : (
            <ul>
              <li>
                Discuta com seu time em qual número do medidor de ondas telepáticas você acha que a dica se
                melhor encaixa.
              </li>
              <li>
                Todos podem controlar o ponteiro usando a barra abaixo, mas somente{' '}
                {amITheController ? 'VOCÊ ' : <AvatarName player={teamController} />}pode apertar o botão para
                enviar a resposta final.
              </li>
            </ul>
          )}
        </Instruction>
      ) : (
        <Instruction contained>
          O outro time agora está tentando adivinhar onde no medidor de ondas telepáticas a dica se encaixa
          melhor. Na próxima fase, você e seu time terão a change de contra-atacar dizendo se a solução está
          mais para esquerda ou mais para a direita do que eles escolheram!
        </Instruction>
      )}

      {isMyTeamActive && (
        <div>
          <Slider defaultValue={0} min={-10} max={10} onChange={setNeedle} />
          {amITheController && (
            <div className="container container--transparent container--center">
              <Button
                type="primary"
                onClick={() => {
                  onSendGuess({ guess: needle });
                }}
                disabled={!amITheController}
              >
                Enviar resposta: {needle}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DialGuessSelection.propTypes = {
  onSendGuess: PropTypes.func.isRequired,
  card: PropTypes.shape({
    id: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
  }).isRequired,
  activeTeam: PropTypes.oneOf(['A', 'B']),
  teamController: PropTypes.object,
  amITheController: PropTypes.bool,
  isMyTeamActive: PropTypes.bool,
  amIThePsychic: PropTypes.bool,
};

export default DialGuessSelection;
