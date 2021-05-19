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
}) {
  const [needle, setNeedle] = useState(0);

  return (
    <div className="o-dial-guess-selection">
      <Title>Time {activeTeam}, hora de brilhar!</Title>
      <Instruction contained>
        Qual número melhor indica <span className="o-dial-guess-selection__clue">{card.clue}</span> na escala
        de{' '}
        <strong>
          {card.left}-{card.right}
        </strong>
        ?
      </Instruction>

      <Dial
        card={card}
        showTarget={false}
        target={card.target}
        showNeedle={amITheController}
        needle={needle}
      />

      {isMyTeamActive ? (
        <Instruction contained>
          Discuta com seu time em qual número do espectro você acha que a dica cabe melhor. Se você é o
          psíquico dessa rodada, boca fechada!
          <br />
          {amITheController ? 'VOCÊ ' : <AvatarName player={teamController} />}está no comando para apertar o
          ponteiro.
        </Instruction>
      ) : (
        <Instruction contained>
          O outro time agora está tentando adivinhar onde no espectro a dica se encaixa. Na próxima fase, você
          e seu time terão a change de contra-atacar!
        </Instruction>
      )}

      {amITheController && (
        <div>
          <Slider defaultValue={0} min={-10} max={10} onChange={setNeedle} />
          <div className="container container--transparent container--center">
            <Button
              type="primary"
              onClick={() => {
                onSendGuess({ guess: needle });
              }}
            >
              Enviar resposta
            </Button>
          </div>
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
};

export default DialGuessSelection;
