// Components
import { AdminNextRoundButton } from 'components/admin';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { RankingBoard } from 'components/ranking';
import { Step } from 'components/steps';
import { Instruction, RoundsLeftInstruction, Title } from 'components/text';
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
  return (
    <Step>
      <Title>
        <Translate pt="O impostor era " en="The impostor was " />
        <AvatarName player={impostor} />
      </Title>
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
                They did not get enough votes: the <b>Impostor</b> gets 5 points and the <b>Lead Detective</b>{' '}
                gets 4 points!
              </>
            }
          />
        )}
      </Instruction>
      <VotingOptions players={players} isAllDisabled={true} leaderId={leaderId} onVote={(...args) => {}} />
      <RankingBoard players={players} ranking={ranking} />

      <RoundsLeftInstruction round={round} lastRound={lastRound} />

      <TableFocus table={table} currentPlayer={impostor} />

      <AdminNextRoundButton round={round} lastRound={lastRound} />
    </Step>
  );
}
