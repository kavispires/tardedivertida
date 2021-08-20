import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Popconfirm, Slider } from 'antd';
// Components
import { ButtonContainer, Instruction, Title } from '../../components/shared';
import Dial from './Dial';
import { AvatarName } from '../../components/avatars';

function Prompt({ card }) {
  return (
    <Instruction contained>
      Qual número melhor indica <span className="o-dial-guess-selection__clue">{card.clue}</span> na escala de{' '}
      <strong>
        {card.left}-{card.right}
      </strong>
      ?
    </Instruction>
  );
}

function TeamInstructions({ teamController }) {
  return (
    <Instruction contained>
      <ul>
        <li>
          Discuta com seu time em qual número do medidor de ondas telepáticas você acha que a dica se melhor
          encaixa.
        </li>
        <li>
          Todos podem controlar o ponteiro usando a barra abaixo, mas somente{' '}
          <AvatarName player={teamController} addressUser /> pode apertar o botão para enviar a resposta
          final.
        </li>
      </ul>
    </Instruction>
  );
}

function PsychicView({ card, needle, setNeedle }) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Seu time está pensando...</Title>
      <Prompt card={card} />
      <Dial card={card} target={card.target} needle={needle} showNeedle showTarget setNeedle={setNeedle} />
      <Instruction contained>Pokerface e bico fechado!</Instruction>
    </div>
  );
}

function ControllerView({ activeTeam, card, needle, onSendGuess, setNeedle, teamController }) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Hora de brilhar, Time {activeTeam}!</Title>
      <Prompt card={card} />
      <Dial
        card={card}
        target={card.target}
        needle={needle}
        showNeedle
        showTarget={false}
        setNeedle={setNeedle}
      />
      <Slider defaultValue={0} min={-10} max={10} onChange={setNeedle} value={needle} />
      <TeamInstructions teamController={teamController} />
      <ButtonContainer>
        <Popconfirm
          title="Essa é a sua resposta final?"
          onConfirm={() => {
            onSendGuess({ guess: needle });
          }}
          okText="Sim"
          cancelText="Não"
        >
          <Button type="primary">
            Enviar resposta: {needle < 0 ? card.left : card.right} » {Math.abs(needle)}
          </Button>
        </Popconfirm>
      </ButtonContainer>
    </div>
  );
}

function ActiveTeamView({ activeTeam, card, needle, setNeedle, teamController }) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Hora de brilhar, Time {activeTeam}!</Title>
      <Prompt card={card} />
      <Dial
        card={card}
        target={card.target}
        needle={needle}
        showNeedle
        showTarget={false}
        setNeedle={setNeedle}
      />
      <Slider defaultValue={0} min={-10} max={10} onChange={setNeedle} value={needle} />
      <TeamInstructions teamController={teamController} />
    </div>
  );
}

function OtherTeamView({ activeTeam, card, needle }) {
  return (
    <div className="o-dial-guess-selection">
      <Title>Hora do time {activeTeam} brilhar!</Title>
      <Prompt card={card} />
      <Dial card={card} target={card.target} needle={needle} showNeedle={false} showTarget={false} />
      <Instruction contained>
        O outro time agora está tentando adivinhar onde no medidor de ondas telepáticas a dica se encaixa
        melhor. Daqui a pouco, você e seu time terão a change de contra-atacar dizendo se a solução está mais
        para esquerda ou mais para a direita do que eles escolheram!
      </Instruction>
    </div>
  );
}

function viewDelegator(isUserThePsychic, isUserTheController, isUsersTeamActive) {
  if (isUserThePsychic) {
    return PsychicView;
  }
  if (isUserTheController) {
    return ControllerView;
  }
  if (isUsersTeamActive) {
    return ActiveTeamView;
  }
  return OtherTeamView;
}

function DialGuessSelection({
  activeTeam,
  card,
  isUsersTeamActive,
  isUserTheController,
  isUserThePsychic,
  onSendGuess,
  teamController,
}) {
  const [needle, setNeedle] = useState(0);

  const ActiveComponent = viewDelegator(isUserThePsychic, isUserTheController, isUsersTeamActive);

  return (
    <ActiveComponent
      activeTeam={activeTeam}
      needle={needle}
      onSendGuess={onSendGuess}
      teamController={teamController}
      card={card}
      setNeedle={setNeedle}
    />
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
  isUserTheController: PropTypes.bool,
  isMyTeamActive: PropTypes.bool,
  isUserThePsychic: PropTypes.bool,
};

export default DialGuessSelection;
