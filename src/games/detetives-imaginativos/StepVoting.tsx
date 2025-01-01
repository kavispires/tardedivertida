// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';
import { ReadyPlayersBar } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { CardEntry } from './utils/types';
import { Table } from './components/Table';
import { VotingOptions } from './components/VotingOptions';
// Icons

type StepVotingProps = {
  isLoading: boolean;
  isUserTheLeader: boolean;
  leaderId: PlayerId;
  user: GamePlayer;
  players: GamePlayers;
  onVote: GenericFunction;
  table: CardEntry[];
} & Pick<StepProps, 'announcement'>;

export function StepVoting({
  isLoading,
  isUserTheLeader,
  user,
  leaderId,
  players,
  onVote,
  table,
  announcement,
}: StepVotingProps) {
  return (
    <Step announcement={announcement}>
      <StepTitle wait={isLoading}>
        {!isLoading && <Translate pt="Quem é o impostor?" en="Who is the impostor?" />}
      </StepTitle>
      <Instruction contained>
        <ViewIf condition={isUserTheLeader}>
          <Translate
            pt={
              <>
                Aguarde enquanto os outros jogadores votam em quem eles acham ser o impostor.{' '}
                <strong>Como Líder, você não vota.</strong>
              </>
            }
            en={
              <>
                Wait while the other detectives vote. <strong>As Lead Detective, you don't vote.</strong>
              </>
            }
          />
        </ViewIf>
        <ViewIf condition={!isUserTheLeader && !user.vote}>
          <Translate
            pt={
              <>
                Vote para quem você acha que pode ser o impostor! Lembre-se, o impostor só perde se{' '}
                <PlayersHighlight>2+</PlayersHighlight> detetives votarem nele.
              </>
            }
            en={
              <>
                Vote for who you think is the impostor! Remember, the impostor only goes down if they get{' '}
                <PlayersHighlight>2+</PlayersHighlight> votes.
              </>
            }
          />
        </ViewIf>
        <ViewIf condition={!isUserTheLeader && user.vote}>
          <Translate
            pt="Aguarde enquanto os outros jogadores votam..."
            en="Wait while other detectives finish voting..."
          />
        </ViewIf>
      </Instruction>

      <VotingOptions
        players={players}
        leaderId={leaderId}
        user={user}
        onVote={onVote}
        isLoading={isLoading}
        isAllDisabled={isUserTheLeader}
      />

      <Table table={table} players={players} />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
