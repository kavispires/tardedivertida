import clsx from 'clsx';
import { ReactNode } from 'react';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { CandyIcon } from 'components/icons/CandyIcon';
import { HouseIcon } from 'components/icons/HouseIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { WalkIcon } from 'components/icons/WalkIcon';
import { Translate } from 'components/language';
import { CostumeAvatar } from './CostumeAvatar';
import { TrickOrTreatIcon } from 'components/icons/TrickOrTreatIcon';
import { ScaredIcon } from 'components/icons/ScaredIcon';

type PlayersDecisionStateProps = {
  players: GamePlayers;
  goingHomePlayerIds: PlayerId[];
  continuingPlayerIds: PlayerId[];
  alreadyAtHomePlayerIds: PlayerId[];
  cashedInCandy: number;
  candyInHand: number;
  phase: 'TRICK_OR_TREAT' | 'RESULT' | 'STREET_END';
};

export function PlayersDecisionState({
  players,
  goingHomePlayerIds,
  continuingPlayerIds,
  alreadyAtHomePlayerIds,
  cashedInCandy,
  candyInHand,
  phase,
}: PlayersDecisionStateProps) {
  return (
    <div className="n-players-decision">
      <DecisionSection
        players={players}
        playersInSection={alreadyAtHomePlayerIds}
        icon={<HouseIcon />}
        title={<Translate pt="Em Casa" en="At Home" />}
        description={
          <Translate
            pt="Você se lembra quantos doces eles levaram?"
            en="Do you remember how much candy they took?"
          />
        }
      />
      <div className="n-players-decision__divider" />
      <DecisionSection
        players={players}
        playersInSection={goingHomePlayerIds}
        icon={<WalkIcon className="svg-mirror" />}
        title={<Translate pt="Voltando pra Casa" en="Going Home" />}
        description={
          <Translate
            pt={
              <>
                Cada um levou {candyInHand + cashedInCandy} <IconAvatar icon={<CandyIcon />} size="small" />{' '}
                pra casa.
              </>
            }
            en={
              <>
                Each one took {candyInHand + cashedInCandy} <IconAvatar icon={<CandyIcon />} size="small" />{' '}
                home.
              </>
            }
          />
        }
      />
      <div className="n-players-decision__divider" />
      <DecisionSection
        players={players}
        playersInSection={continuingPlayerIds}
        icon={phase === 'STREET_END' ? <ScaredIcon /> : <TrickOrTreatIcon />}
        title={
          <>
            {phase === 'TRICK_OR_TREAT' && (
              <Translate pt="Continua ou Volta?" en="Continuing or Going Home?" />
            )}
            {phase === 'RESULT' && <Translate pt="Continuando" en="Continuing" />}
            {phase === 'STREET_END' && <Translate pt="Continuariam" en="Would continue" />}
          </>
        }
        description={
          phase === 'STREET_END' ? (
            <Translate
              pt={
                <>
                  Perderam {candyInHand} <IconAvatar icon={<CandyIcon />} size="small" />.
                </>
              }
              en={
                <>
                  Lost {candyInHand} <IconAvatar icon={<CandyIcon />} size="small" /> .
                </>
              }
            />
          ) : (
            <Translate
              pt={
                <>
                  Cada um tem {candyInHand} <IconAvatar icon={<CandyIcon />} size="small" /> na sacolinha.
                </>
              }
              en={
                <>
                  Each one has {candyInHand} <IconAvatar icon={<CandyIcon />} size="small" /> in their bag.
                </>
              }
            />
          )
        }
      />
    </div>
  );
}

type DecisionSectionProps = {
  players: GamePlayers;
  playersInSection: PlayerId[];
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
};

function DecisionSection({ players, playersInSection, icon, title, description }: DecisionSectionProps) {
  const hasPlayers = playersInSection.length > 0;

  return (
    <div className={clsx('n-players-decision__section', !hasPlayers && 'n-players-decision__section--empty')}>
      <h3
        className={clsx(
          'n-players-decision__title',
          !hasPlayers && getAnimationClass('fadeOut') && 'n-players-decision__title--empty'
        )}
      >
        <IconAvatar icon={icon} />
        {title}
      </h3>

      <ul className="n-players-decision__players">
        {hasPlayers &&
          playersInSection.map((playerId) => {
            const player = players[playerId];
            return (
              <span key={`going-home-player-${player.id}`} className="n-players-decision__player">
                <CostumeAvatar id={player.avatarId} costumeId={player.costumeId} />
                {player.name}
              </span>
            );
          })}
      </ul>
      <p className={clsx('n-players-decision__info', !hasPlayers && 'n-players-decision__info--empty')}>
        {hasPlayers && description}
      </p>
    </div>
  );
}