// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Instruction } from 'components/text';

export function DJInstructions({ round }: { round: GameRound }): JSX.Element {
  if (round.current <= 1) {
    return (
      <Instruction contained>
        <Translate
          pt={
            <>
              Fala galera! Eu sou o DJ PruPruPru!
              <br />O objetivo desse jogo é <strong>entrar</strong> e <strong>permanecer</strong> na área VIP!
              <br />
              Você consegue isso se você sempre responder com a maioria! Não importa se está certo ou errado.
              <br />
              Ao responder com a maioria, você ganha <PointsHighlight type="positive">1</PointsHighlight>{' '}
              ponto por entrar na área VIP ou <PointsHighlight type="positive">2</PointsHighlight> points se
              você estiver lá.
              <br /> Vamos aos hits!
            </>
          }
          en={
            <>
              Yo my party people! I'm DJ PruPruPru!
              <br />
              The goal of the game is to <strong>join</strong> and <strong>stay</strong> in the VIP area!
              <br />
              You achieve this by always answering the tasks with the majority. It doesn't matter if it's
              wrong or right.
              <br />
              When answering with the majority, you gain <PointsHighlight type="positive">
                1
              </PointsHighlight>{' '}
              point for joining the VIP area or <PointsHighlight type="positive">2</PointsHighlight> points if
              you're already there.
              <br />
              Let's play those hits!
            </>
          }
        />
      </Instruction>
    );
  }

  if (round.current === Math.round(round.total / 2)) {
    return (
      <Instruction contained>
        <Translate
          pt={
            <>
              DJ PruPruPru está de volta!
              <br />
              Estamos no meio da noite! Você está conseguindo ficar na área VIP?
            </>
          }
          en={
            <>
              DJ PruPruPru back here!
              <br />
              We're halfway. Are you able to stay in the VIP area?
            </>
          }
        />
      </Instruction>
    );
  }

  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Última rodada! Ganha quem estiver na área VIP com mais pontos!
            <br />
            Será que será você?
          </>
        }
        en={
          <>
            It's the last round! The player with the most points in the VIP area will win!
            <br />
            Will that be you?
          </>
        }
      />
    </Instruction>
  );
}
