import clsx from 'clsx';
import { orderBy } from 'lodash';
// Components
import {
  Avatar,
  AvatarName,
  PopoverRule,
  Instruction,
  StarPoints,
  Step,
  TimedButton,
  Title,
  Translate,
} from '../../components';
import { Dial } from './Dial';
import { getGuessResultClass, getPoints } from './helpers';
import { ScoringRules } from './RulesBlobs';

type SentenceProps = {
  currentCategory: OCurrentCategory;
};

function Sentence({ currentCategory }: SentenceProps) {
  return (
    <>
      <Translate pt="O resultado para" en="The answer for" />
      <span className="o-dial-guess-selection__clue">{currentCategory.clue}</span>{' '}
      <Translate pt="na escala" en="on the scale" />{' '}
      <strong>
        {currentCategory.left}-{currentCategory.right}
      </strong>
      :
    </>
  );
}

type StepRevealProps = {
  currentCategory: OCurrentCategory;
  players: GamePlayers;
  psychic: GamePlayer;
  setStep: GenericFunction;
};

export function StepReveal({ setStep, currentCategory, players, psychic }: StepRevealProps) {
  const regularPlayers = Object.values(players).filter((p) => p.id !== psychic.id);

  return (
    <Step>
      <Title level={2} className="o-step-reveal-title">
        <Sentence currentCategory={currentCategory} />
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
          en={
            <>
              Are you in sync? <AvatarName player={psychic} /> {psychic.guess ? 'does' : "doesn't"} think so
            </>
          }
        />
      </Instruction>
      <ul className="o-player-guesses">
        {orderBy(regularPlayers, ['guess', 'name']).map((player) => {
          return (
            <li className="o-player-guess" key={player.id}>
              <span
                className={clsx(
                  'o-player-guess__guess',
                  getGuessResultClass(player.guess, currentCategory.target!)
                )}
              >
                {player.guess < 0 && '«'}
                {Math.abs(player.guess)}
                {player.guess > 0 && '»'}
              </span>
              <Avatar id={player.avatarId} className="o-player-guess__avatar" />
              <span className="o-player-guess__name">{player.name}</span>
              <StarPoints
                quantity={getPoints(player.guess, currentCategory.target!)}
                keyPrefix={`${player.id}-points`}
              />
            </li>
          );
        })}
      </ul>

      <PopoverRule
        // label={<Translate pt="Como a pontuação funciona?" en="How does scoring work?" />}
        content={<ScoringRules />}
      />

      <TimedButton
        duration={30}
        label={<Translate pt="Continuar" en="Continue" />}
        onExpire={() => setStep(2)}
        onClick={() => setStep(2)}
      />
    </Step>
  );
}
