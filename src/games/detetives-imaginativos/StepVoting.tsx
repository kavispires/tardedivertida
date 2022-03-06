// Components
import { AvatarIcon, Instruction, Step, Title, Translate, ViewIf } from 'components';
import { Table } from './Table';
import { VotingOptions } from './VotingOptions';

type StepVotingProps = {
  isLoading: boolean;
  isUserTheLeader: boolean;
  leaderId: PlayerId;
  user: GamePlayer;
  players: GamePlayers;
  onVote: GenericFunction;
  table: DetetivesImaginativosCardEntry[];
};

export function StepVoting({
  isLoading,
  isUserTheLeader,
  user,
  leaderId,
  players,
  onVote,
  table,
}: StepVotingProps) {
  return (
    <Step>
      <Title>
        {isLoading ? (
          <AvatarIcon type="animated-clock" size="large" />
        ) : (
          <Translate pt="Quem é o impostor?" en="Who is the impostor?" />
        )}
      </Title>
      <Instruction contained>
        <ViewIf isVisible={isUserTheLeader}>
          <Translate
            pt="Aguarde enquanto os outros jogadores votam em quem eles acham ser o impostor. Como Líder, você não vota."
            en="Wait while the other detectives vote. As Lead Detective, you don't vote."
          />
        </ViewIf>
        <ViewIf isVisible={!isUserTheLeader && !user.vote}>
          <Translate
            pt="Vote para quem você acha que pode ser o impostor! Lembre-se, o impostor só perde se 2 ou mais detetives votarem nele."
            en="Vote for who you think can be the impostor! Remember, the impostor only goes down if they get 2 or more votes."
          />
        </ViewIf>
        <ViewIf isVisible={!isUserTheLeader && user.vote}>
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
    </Step>
  );
}
