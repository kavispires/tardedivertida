// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { AdminNextPhaseButton } from 'components/admin';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Instruction, RoundsLeftInstruction } from 'components/text';
import { TableFocus } from './components/TableFocus';
import { VotingOptions } from './components/VotingOptions';

type StepRevealProps = {
  impostor: GamePlayer;
  impostorVotes: number;
  players: GamePlayers;
  leaderId: PlayerId;
  round: GameRound;
  ranking: GameRanking;
  table: DetetivesImaginativosCardEntry[];
  lastRound?: boolean;
};

export function StepReveal({
  impostor,
  impostorVotes,
  players,
  leaderId,
  round,
  ranking,
  table,
  lastRound = false,
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[]}
      title={
        <>
          <Translate pt="O impostor era " en="The impostor was " />
          <AvatarName player={impostor} />
        </>
      }
      subtitle={
        <>
          <Instruction contained>
            {impostorVotes > 1 ? (
              <Translate
                pt="Ele(a) recebeu mais de dois votos! Quem votou nele(a) ganha 3 pontos!"
                en="They received more than 2 votes! Who voted for them gets 3 points!"
              />
            ) : (
              <Translate
                pt={
                  <>
                    Ele(a) não recebeu mais de 2 votos: <b>Impostor</b> ganha 5 pontos e <b>Líder</b> ganha 4
                    pontos!
                  </>
                }
                en={
                  <>
                    They did not get enough votes: the <b>Impostor</b> gets 5 points and the{' '}
                    <b>Lead Detective</b> gets 4 points!
                  </>
                }
              />
            )}
          </Instruction>
          <VotingOptions
            players={players}
            isAllDisabled={true}
            leaderId={leaderId}
            onVote={(...args) => {}}
          />
        </>
      }
    >
      <RoundsLeftInstruction round={round} lastRound={lastRound} />

      <TableFocus table={table} currentPlayer={impostor} />

      <AdminNextPhaseButton round={round} lastRound={lastRound} />
    </StepRankingWrapper>
  );
}
