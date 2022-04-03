import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

export function VotingRules(): JSX.Element {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Hora de selecionar a carta correta!
            <br />
            Se todos acertarem ou todos errarem, cada jogador ganha 2 pontos, menos o contador de histórias.
            <br />
            Se somente alguns acertarem, cada acertador e contador de histórias recebe 3 pontos.
            <br />
            Sua carta (se você não for o contador de histórias) ganha 1 ponto se alguém selecionar.
          </>
        }
        en={
          <>
            Time to select the correct card!
            <br />
            If every player gets it correct or wrong, each player but the storyteller gets 2 points.
            <br />
            If only some get it correct, those players (and the storyteller) get 3 points.
            <br />
            You get 1 point for every vote your card gets (if you are not the storyteller).
          </>
        }
      />
    </Instruction>
  );
}

type ScoringRulesProps = {
  storyteller: GamePlayer;
};

export function ScoringRules({ storyteller }: ScoringRulesProps) {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Hora de revelar a resposta correta!
            <br />O Contador de Histórias {<Avatar id={storyteller.avatarId} size="small" />} ganha 3 pontos
            se pelo menos uma pessoa acertar (mas não todas).
            <br />
            Cada jogador que votou corretamente ganha 3 pontos.
            <br />
            Para cada voto que sua carta recebeu (menos {<Avatar id={storyteller.avatarId} size="small" />}),
            você ganha 1 ponto.
            <br />
            Mas se todos jogadores votarem corretamente ou incorretamente, todos ganham 2 pontos e o Contador
            de Histórias não ganha nada.
          </>
        }
        en={
          <>
            Time to reveal the answer!
            <br />
            The Storyteller {<Avatar id={storyteller.avatarId} size="small" />} gets 3 points if at least one
            player got it correctly (but not all).
            <br />
            Each player who voted correctly gets 3 points.
            <br />
            Each vote your card receives grants you 1 points (except{' '}
            {<Avatar id={storyteller.avatarId} size="small" />}).
            <br />
            But if all players vote correctly or incorrectly, they get 2 points each and the Storyteller gets
            nothing.
          </>
        }
      />
    </Instruction>
  );
}
