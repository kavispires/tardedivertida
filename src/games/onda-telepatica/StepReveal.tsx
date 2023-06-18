import { useMemo } from 'react';
import clsx from 'clsx';
import { orderBy } from 'lodash';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { countDifferentGuesses, getGuessResultClass, getPoints } from './utils/helpers';
import { getMeanDuration } from 'utils/helpers';
// Components
import { Avatar, AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { StarPoints } from 'components/points';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Dial } from './components/Dial';
import { Instruction, Title } from 'components/text';
import { ScoringRules } from './components/RulesBlobs';

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
  goToNextStep: GenericFunction;
} & AnnouncementProps;

export function StepReveal({
  goToNextStep,
  currentCategory,
  players,
  psychic,
  announcement,
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();
  const regularPlayers = useMemo(
    () => Object.values(players).filter((p) => p.id !== psychic.id),
    [players, psychic.id]
  );
  const duration = useMemo(
    () => getMeanDuration(countDifferentGuesses(regularPlayers), 4, 10, 20),
    [regularPlayers]
  );

  return (
    <Step fullWidth announcement={announcement}>
      <Title level={2} className="o-step-reveal-title" size="small">
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

      <PopoverRule content={<ScoringRules />} />

      <TimedButton duration={duration} onExpire={goToNextStep} onClick={goToNextStep}>
        <Translate pt="Continuar" en="Continue" />
      </TimedButton>
    </Step>
  );
}
