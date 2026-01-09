import clsx from 'clsx';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { HostButton, HostOnlyContainer } from 'components/host';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
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
  useTemporarilyHidePlayersBar();
  const { isLoading } = useLoading();

  return (
    <Step className="e-phase-step">
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
        <Instruction className="e-phase-instruction">
          <Translate
            pt={
              <>
                Os agentes tentaram incriminar {target.name}
                {resolutionStatus.didTheSpyWin ? ' e erraram feio!' : ' e acertaram na mosca!'}
                <br />
                {resolutionStatus.didTheSpyWin
                  ? `O espião era ${currentSpy.name}! Todos os segredos da agência foram revelados e o mundo vai acabar.`
                  : 'Parabéns! O mundo está salvo graças a você.'}
                <br />
                {resolutionStatus.wasABadVoting &&
                  'Da próxima vez, discutam mais antes de fazerem uma votação precipitada.'}
              </>
            }
            en={
              <>
                The agents tried to pin {target.name}
                {resolutionStatus.didTheSpyWin ? ' and got it all wrong!' : " and hit the bull's eye!"}
                <br />
                {resolutionStatus.didTheSpyWin
                  ? `The spy was ${currentSpy.name}! All of the agency secrets were revealed and the world will end.`
                  : 'Congratulations! The world is safe and sound thanks to you.'}
                <br />
                {resolutionStatus.wasABadVoting && 'Next time, discuss more before making a rash decision.'}
              </>
            }
          />
        </Instruction>
      )}

      {resolutionStatus.didSpyGuess && resolutionStatus.currentLocation && (
        <Instruction className="e-phase-instruction">
          <Translate
            pt={
              <>
                O espião disse que o local é {resolutionStatus.guess.name}
                {resolutionStatus.didTheSpyWin
                  ? ' e acertou na mosca!'
                  : ` e errou feio! Os Agentes estão num(a) ${resolutionStatus.currentLocation.name}.`}
                <br />
                {resolutionStatus.didTheSpyWin
                  ? 'Todos os segredos da agência foram revelados e o mundo vai acabar.'
                  : 'Foi por pouco, mas não foi dessa vez que o mal venceu.'}
              </>
            }
            en={
              <>
                The spy guessed the location: {resolutionStatus.guess.name}
                {resolutionStatus.didTheSpyWin
                  ? " and hit the bull's eye!"
                  : ` and got it all wrong! The agents were at a ${resolutionStatus.currentLocation.name}.`}
                <br />
                {resolutionStatus.didTheSpyWin
                  ? 'All of the agency secrets were revealed and the world will end...'
                  : "That was close... but evil won't win this time."}
              </>
            }
          />
        </Instruction>
      )}

      <Instruction className="e-phase-instruction">
        <h4>{resolutionStatus.currentLocation?.name}</h4>
        <Translate
          pt="Disfarces dos infiltrados:"
          en="Agent's roles:"
        />
        {Object.values(players).map(({ id, name, role }) => (
          <li key={`role-list-${id}`}>
            {name}{' '}
            <Translate
              pt="como"
              en="as"
            />{' '}
            {role === 'SPY' ? (
              <Translate
                pt="ESPIÃO"
                en="SPY"
              />
            ) : (
              role
            )}
          </li>
        ))}
      </Instruction>

      {
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
      }
    </Step>
  );
}
