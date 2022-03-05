// Components
import {
  AdminNextRoundButton,
  AvatarName,
  Instruction,
  RankingBoard,
  RoundsLeftInstruction,
  Step,
  Title,
  Translate,
} from 'components';
import VotingOptions from './VotingOptions';

type StepRevealProps = {
  impostor: GamePlayer;
  impostorVotes: number;
  players: GamePlayers;
  leaderId: PlayerId;
  round: GameRound;
  ranking: GameRanking;
  lastRound?: boolean;
};

function StepReveal({
  impostor,
  impostorVotes,
  players,
  leaderId,
  round,
  ranking,
  lastRound = false,
}: StepRevealProps) {
  return (
    <Step>
      <Title>
        <Translate pt="O impostor era " en="The impostor was " />
        {<AvatarName player={impostor} />}
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

      <RoundsLeftInstruction round={round} />

      <AdminNextRoundButton round={round} lastRound={lastRound} />
    </Step>
  );
}

export default StepReveal;
