import clsx from 'clsx';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
// Components
import { HostButton } from '@components/host/HostButton';
import { HostOnlyContainer } from '@components/host/HostOnlyContainer';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { ResolutionStatus } from './utils/types';

type StepVotingProps = {
  players: GamePlayers;
  currentSpy: GamePlayer;
  resolutionStatus: ResolutionStatus;
  target?: GamePlayer;
  onProgressGame: GenericFunction;
};

export function StepResolution({
  players,
  target,
  resolutionStatus,
  currentSpy,
  onProgressGame,
}: StepVotingProps) {
  const { isLoading } = useLoading();

  return (
    <Step
      className="e-phase-step"
      hidePlayersBar
    >
      <StepTitle
        className={clsx('e-phase-title', !resolutionStatus.isPlayerVictory && 'e-phase-title--fail')}
      >
        {resolutionStatus.isPlayerVictory ? (
          <Translate
            pt="Missão Cumprida!"
            en="Mission Accomplished!"
          />
        ) : (
          <Translate
            pt="Missão Fracassada"
            en="Mission Failed"
          />
        )}
      </StepTitle>

      {resolutionStatus.wasAnAccusationAttempt && target && (
        <Surface className="e-phase-instruction">
          <Translate
            en={`The agents tried to pin {target} and ${resolutionStatus.didTheSpyWin ? 'got it all wrong!' : "hit the bull's eye!"}!`}
            pt={`Os agentes tentaram incriminar {target} e ${resolutionStatus.didTheSpyWin ? 'erraram feio!' : 'acertaram na mosca!'}`}
            values={{
              target: <PlayerAvatarName player={target} />,
            }}
          />
          <br />
          {resolutionStatus.didTheSpyWin ? (
            <Translate
              pt="O espião era {spy}! Todos os segredos da agência foram revelados e o mundo vai acabar."
              en="The spy was {spy}! All of the agency secrets were revealed and the world will end."
              values={{
                spy: <PlayerAvatarName player={currentSpy} />,
              }}
            />
          ) : (
            <Translate
              pt="Parabéns! O mundo está salvo graças a você."
              en="Congratulations! The world is safe and sound thanks to you."
            />
          )}
          {resolutionStatus.wasABadVoting && (
            <Translate
              en="
              <br/>
              Next time, discuss more before making a rash decision."
              pt="
              <br/>
              Da próxima vez, discutam mais antes de fazerem uma votação precipitada."
            />
          )}
        </Surface>
      )}

      {resolutionStatus.didSpyGuess && resolutionStatus.currentLocation && (
        <Surface className="e-phase-instruction">
          <Translate
            en={`The spy guessed the location: {guess} ${resolutionStatus.didTheSpyWin ? " and hit the bull's eye!" : ' and got it all wrong!'}`}
            pt={`O espião disse que o local é {guess} ${resolutionStatus.didTheSpyWin ? ' e acertou na mosca!' : ' e errou feio!'}`}
            values={{
              guess: <strong>{resolutionStatus.guess.name}</strong>,
            }}
          />
          <Translate
            en="
            <br/>
            All agency secrets were revealed and the world will end..."
            pt="
            <br/>
            Todos os segredos da agência foram revelados e o mundo vai acabar..."
          />
        </Surface>
      )}

      <Surface className="e-phase-instruction">
        <h4>{resolutionStatus.currentLocation?.name}</h4>
        <Translate
          pt="Disfarces dos infiltrados:"
          en="Agent's roles:"
        />
        {Object.values(players).map(({ id, name, role }) => (
          <li key={`role-list-${id}`}>
            <Translate
              en="{name} as {role}"
              pt="{name} como {role}"
              values={{
                name: <strong>{name}</strong>,
                role: (
                  <strong>
                    {role === 'SPY' ? (
                      <Translate
                        pt="ESPIÃO"
                        en="SPY"
                      />
                    ) : (
                      role
                    )}
                  </strong>
                ),
              }}
            />
          </li>
        ))}
      </Surface>

      <HostOnlyContainer>
        <HostButton
          onClick={() => onProgressGame({ continue: true })}
          disabled={isLoading}
        >
          <Translate
            pt="Jogar mais uma rodada"
            en="Play another round"
          />
        </HostButton>
        <HostButton
          onClick={() => onProgressGame({ end: true })}
          disabled={isLoading}
        >
          <Translate
            pt="Terminar Jogo"
            en="End Game"
          />
        </HostButton>
      </HostOnlyContainer>
    </Step>
  );
}
