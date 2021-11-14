import PropTypes from 'prop-types';
// Components
import { Instruction, Step, TimedButton, Title, Translate } from '../../components/shared';
import Dial from './Dial';
import { Avatar, AvatarName } from '../../components/avatars';
import clsx from 'clsx';
import { CollapsibleRule } from '../../components/rules';

function Sentence({ card }) {
  return (
    <>
      <Translate pt="O resultado para" en="The answer for" />
      <span className="o-dial-guess-selection__clue">{card.clue}</span>{' '}
      <Translate pt="na escala" en="on the scale" />{' '}
      <strong>
        {card.left}-{card.right}
      </strong>{' '}
    </>
  );
}

const getGuessResultClass = (guess, target) => {
  const base = 'o-player-guess__guess';
  if (target - guess === 0) return `${base}--blue`;
  if (Math.abs(target - guess) === 1) return `${base}--orange`;
  if (Math.abs(target - guess) === 2) return `${base}--yellow`;
  return '';
};

function StepReveal({ setStep, currentCategory, players, psychic }) {
  const regularPlayers = Object.values(players).filter((p) => p.id !== psychic.id);

  return (
    <Step className="o-dial-guess-selection">
      <Title level={2}>
        <Sentence card={currentCategory} />
      </Title>

      <Dial card={currentCategory} target={currentCategory.target} showTarget animate />

      <Instruction contained>
        <Translate
          pt={
            <>
              Vocês estão sincronizados? <AvatarName player={psychic} /> acha que{' '}
              {psychic.guess ? 'sim' : 'não'}
            </>
          }
          en={`Are you in sync? ${(<AvatarName player={psychic} />)} ${
            psychic.guess ? 'does' : "doesn't"
          } think so`}
        />
      </Instruction>
      <ul className="o-player-guesses">
        {regularPlayers.map((player) => {
          return (
            <li className="o-player-guess" key={player.id}>
              <span
                className={clsx(
                  'o-player-guess__guess',
                  getGuessResultClass(player.guess, currentCategory.target)
                )}
              >
                {player.guess < 0 && '«'}
                {Math.abs(player.guess)}
                {player.guess > 0 && '»'}
              </span>
              <Avatar id={player.avatarId} className="o-player-guess__avatar" />
              <span className="o-player-guess__name">{player.name}</span>
            </li>
          );
        })}
      </ul>

      <CollapsibleRule title={<Translate pt="Como a pontuação funciona?" en="How does scoring work?" />}>
        <Instruction contained>
          <Translate
            pt="Jogadores ganham 4 pontos se acertarem na mosca! Mas 3 e 2 pontos se votaram 1 ou 2 espaços de distância. O Medium ganha 1 ponto para cada jogador que ganhou ponto, num máximo de 3 pontos e se ele(a) chutou a quantidade certa de jogadores que iam acertar, ele ganha mais 2 pontos."
            en="Players get 4 points if they get it exactly right! If one or two spaces away from the needle, they get 3 and 2 points respectively. The psychic gets 1 point for every player that got points this turn (maximum of 3 points) and may get 2 extra points if they guessed the correct number of player who would get the clue right."
          />
        </Instruction>
      </CollapsibleRule>

      <TimedButton
        duration={30}
        label={<Translate pt="Continuar" en="Continue" />}
        onExpire={() => setStep(2)}
        onClick={() => setStep(2)}
      />
    </Step>
  );
}

StepReveal.propTypes = {
  currentCategory: PropTypes.shape({
    left: PropTypes.string,
    right: PropTypes.string,
    target: PropTypes.number,
  }),
  onSendGuess: PropTypes.func,
};

export default StepReveal;
