import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { PointsHighlight } from './Highlights';

export function VotingRules(): JSX.Element {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Hora de selecionar a carta correta!
            <br />
            Se todos acertarem ou todos errarem, cada jogador ganha <PointsHighlight>2</PointsHighlight>{' '}
            pontos, menos o contador de histórias.
            <br />
            Se somente alguns acertarem, cada acertador e contador de histórias recebe{' '}
            <PointsHighlight>3</PointsHighlight> pontos.
            <br />
            Sua carta (se você não for o contador de histórias) ganha <PointsHighlight>
              1
            </PointsHighlight>{' '}
            ponto se alguém selecionar.
          </>
        }
        en={
          <>
            Time to select the correct card!
            <br />
            If every player gets it correct or wrong, each player but the storyteller gets{' '}
            <PointsHighlight>2</PointsHighlight> points.
            <br />
            If only some get it correct, those players (and the storyteller) get{' '}
            <PointsHighlight>3</PointsHighlight>3 points.
            <br />
            You get <PointsHighlight>1</PointsHighlight> point for every vote your card gets (if you are not
            the storyteller).
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
            <br />O Contador de Histórias {<Avatar id={storyteller.avatarId} size="small" />} ganha{' '}
            <PointsHighlight>3</PointsHighlight> pontos se pelo menos uma pessoa acertar (mas não todas).
            <br />
            Cada jogador que votou corretamente ganha <PointsHighlight>3</PointsHighlight> pontos.
            <br />
            Para cada voto que sua carta recebeu (menos {<Avatar id={storyteller.avatarId} size="small" />}),
            você ganha <PointsHighlight>1</PointsHighlight> ponto.
            <br />
            Mas se todos jogadores votarem corretamente ou incorretamente, todos ganham{' '}
            <PointsHighlight>2</PointsHighlight> pontos e o Contador de Histórias não ganha nada.
          </>
        }
        en={
          <>
            Time to reveal the answer!
            <br />
            The Storyteller {<Avatar id={storyteller.avatarId} size="small" />} gets{' '}
            <PointsHighlight>3</PointsHighlight> points if at least one player got it correctly (but not all).
            <br />
            Each player who voted correctly gets <PointsHighlight>3</PointsHighlight> points.
            <br />
            Each vote your card receives grants you <PointsHighlight>1</PointsHighlight> points (except{' '}
            {<Avatar id={storyteller.avatarId} size="small" />}).
            <br />
            But if all players vote correctly or incorrectly, they get <PointsHighlight>
              2
            </PointsHighlight>{' '}
            points each and the Storyteller gets nothing.
          </>
        }
      />
    </Instruction>
  );
}
