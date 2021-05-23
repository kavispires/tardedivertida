import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
// Components
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import Dial from './Dial';
import AvatarName from '../../avatars/AvatarName';
import { BackwardOutlined, ForwardOutlined } from '@ant-design/icons';

function DialRivalSelection({
  activeTeam,
  rivalController,
  amITheRivalController,
  isMyTeamActive,
  onSendRivalGuess,
  card,
}) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Hora do time {activeTeam} contra-atacar!</Title>
      <Instruction contained>
        A solução esta mais pra esquerda ou mais pr direita do número {card.needle} para a dica{' '}
        <span className="o-dial-guess-selection__clue">{card.clue}</span> na escala de{' '}
        <strong>
          {card.left}-{card.right}
        </strong>
        ?
      </Instruction>

      <Dial card={card} showTarget={false} target={card.target} showNeedle needle={card.needle} />

      {isMyTeamActive ? (
        <Instruction contained>
          Você pode ganhar um ponto se escolher a direção correta.
          <br />
          {amITheRivalController ? 'VOCÊ ' : <AvatarName player={rivalController} />}está no comando para
          apertar os botões! <br />E então, a solução está mais para a esquerda ou mais para a direita do
          ponteiro vermelho?
        </Instruction>
      ) : (
        <Instruction contained>
          Agora, o time oposto tem a chance de ganhar 1 ponto ao tentar adivinhar se a solução está mais para
          a esquerda ou mais para a direita do que o seu time escolheu.
        </Instruction>
      )}

      {amITheRivalController && (
        <div className="container container--center container--transparent">
          <Space>
            <Button
              type="primary"
              onClick={() => {
                onSendRivalGuess({ rivalGuess: -1 });
              }}
            >
              <BackwardOutlined /> Mais para a esquerda
            </Button>
            <Button
              type="primary"
              onClick={() => {
                onSendRivalGuess({ rivalGuess: 1 });
              }}
            >
              Mais para a direita <ForwardOutlined />
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}

DialRivalSelection.propTypes = {
  onSendRivalGuess: PropTypes.func.isRequired,
  card: PropTypes.shape({
    id: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
  }).isRequired,
  activeTeam: PropTypes.oneOf(['A', 'B']),
  rivalController: PropTypes.object,
  amITheRivalController: PropTypes.bool,
  isMyTeamActive: PropTypes.bool,
};

export default DialRivalSelection;
