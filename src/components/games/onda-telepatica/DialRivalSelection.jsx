import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
// Components
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import Dial from './Dial';
import { AvatarName } from '../../avatars';
import { BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
import ButtonContainer from '../../shared/ButtonContainer';

function Prompt({ card }) {
  return (
    <Instruction contained>
      A solução esta mais pra esquerda ou mais pr direita do número {card.needle} para a dica{' '}
      <span className="o-dial-guess-selection__clue">{card.clue}</span> na escala de{' '}
      <strong>
        {card.left}-{card.right}
      </strong>
      ?
    </Instruction>
  );
}

function TeamInstructions({ rivalController }) {
  return (
    <Instruction contained>
      Você pode ganhar um ponto se escolher a direção correta.
      <br />
      <AvatarName player={rivalController} addressUser /> está no comando para apertar os botões! <br />E
      então, a solução está mais para a esquerda ou mais para a direita do ponteiro vermelho?
    </Instruction>
  );
}

function RivalControllerView({ activeTeam, card, onSendRivalGuess, rivalController }) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Hora de brilhar, Time {activeTeam}!</Title>
      <Prompt card={card} />
      <ButtonContainer>
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
      </ButtonContainer>
      <Dial card={card} showTarget={false} target={card.target} showNeedle needle={card.needle} />
      <TeamInstructions rivalController={rivalController} />
    </div>
  );
}

function RivalTeamView({ card, rivalController }) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Hora de contra-atacar!</Title>
      <Prompt card={card} />
      <Dial card={card} showTarget={false} target={card.target} showNeedle needle={card.needle} />
      <TeamInstructions rivalController={rivalController} />
    </div>
  );
}

function OtherTeamView({ card, rivalTeam }) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Hora do time {rivalTeam} contra-atacar!</Title>
      <Prompt card={card} />
      <Dial card={card} showTarget={false} target={card.target} showNeedle needle={card.needle} />
      <Instruction contained>
        Agora, o time oposto tem a chance de ganhar 1 ponto ao tentar adivinhar se a solução está mais para a
        esquerda ou mais para a direita do que o seu time escolheu.
      </Instruction>
    </div>
  );
}

function viewDelegator(isUserTheRivalController, isUsersTeamRival) {
  if (isUserTheRivalController) {
    return RivalControllerView;
  }
  if (isUsersTeamRival) {
    return RivalTeamView;
  }
  return OtherTeamView;
}

function DialRivalSelection({
  rivalTeam,
  rivalController,
  isUserTheRivalController,
  isUsersTeamRival,
  onSendRivalGuess,
  card,
}) {
  const ActiveComponent = viewDelegator(isUserTheRivalController, isUsersTeamRival);

  return (
    <ActiveComponent
      card={card}
      rivalTeam={rivalTeam}
      rivalController={rivalController}
      onSendRivalGuess={onSendRivalGuess}
    />

    // return (
    //   <div className="o-dial-guess-selection">
    //     <Title>Hora do time {rivalTeam} contra-atacar!</Title>
    //     <Instruction contained>
    //       A solução esta mais pra esquerda ou mais pr direita do número {card.needle} para a dica{' '}
    //       <span className="o-dial-guess-selection__clue">{card.clue}</span> na escala de{' '}
    //       <strong>
    //         {card.left}-{card.right}
    //       </strong>
    //       ?
    //     </Instruction>

    //     <Dial card={card} showTarget={false} target={card.target} showNeedle needle={card.needle} />

    //     {isUsersTeamRival ? (
    //       <Instruction contained>
    //         Você pode ganhar um ponto se escolher a direção correta.
    //         <br />
    //         {isUserTheRivalController ? 'VOCÊ ' : <AvatarName player={rivalController} />}está no comando para
    //         apertar os botões! <br />E então, a solução está mais para a esquerda ou mais para a direita do
    //         ponteiro vermelho?
    //       </Instruction>
    //     ) : (
    //       <Instruction contained>
    //         Agora, o time oposto tem a chance de ganhar 1 ponto ao tentar adivinhar se a solução está mais para
    //         a esquerda ou mais para a direita do que o seu time escolheu.
    //       </Instruction>
    //     )}

    //     {isUserTheRivalController && (
    //       <div className="container container--center container--transparent">
    //         <Space>
    //           <Button
    //             type="primary"
    //             onClick={() => {
    //               onSendRivalGuess({ rivalGuess: -1 });
    //             }}
    //           >
    //             <BackwardOutlined /> Mais para a esquerda
    //           </Button>
    //           <Button
    //             type="primary"
    //             onClick={() => {
    //               onSendRivalGuess({ rivalGuess: 1 });
    //             }}
    //           >
    //             Mais para a direita <ForwardOutlined />
    //           </Button>
    //         </Space>
    //       </div>
    //     )}
    //   </div>
  );
}

DialRivalSelection.propTypes = {
  onSendRivalGuess: PropTypes.func.isRequired,
  card: PropTypes.shape({
    id: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
  }).isRequired,
  rivalTeam: PropTypes.oneOf(['A', 'B']),
  rivalController: PropTypes.object,
  isUserTheRivalController: PropTypes.bool,
  isUsersTeamRival: PropTypes.bool,
};

export default DialRivalSelection;
