// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function DJInstructions({ round }: { round: GameRound }) {
  if (round.current <= 1) {
    return (
      <Surface contained>
        <Translate
          pt="Fala galera! Eu sou o DJ PruPruPru!
          <br/>
          O objetivo desse jogo é <strong>entrar</strong> e <strong>permanecer</strong> na área VIP!
          <br/>
          Você consegue isso se você sempre responder com a maioria! Não importa se está certo ou errado.
          <br/>
          Ao responder com a maioria, você ganha {joinPoints} por entrar na área VIP ou {stayPoints} se você estiver lá.
          <br/>
          Vamos aos hits!"
          en="Yo my party people! I'm DJ PruPruPru!
          <br/>
          The goal of the game is to <strong>join</strong> and <strong>stay</strong> in the VIP area!
          <br/>
          You achieve this by always answering the tracks with the majority. It doesn't matter if it's wrong or right.
          <br/>
          When answering with the majority, you gain {joinPoints} for joining the VIP area or {stayPoints} if you're already there.
          <br/>
          Let's play those hits!"
          values={{
            joinPoints: (
              <PointsHighlight
                type="positive"
                value={1}
              />
            ),
            stayPoints: (
              <PointsHighlight
                type="positive"
                value={2}
              />
            ),
          }}
        />
      </Surface>
    );
  }

  if (round.current === Math.round(round.total / 2)) {
    return (
      <Surface contained>
        <Translate
          pt="DJ PruPruPru está de volta!
          <br/>
          Estamos no meio da noite! Você está conseguindo ficar na área VIP?"
          en="DJ PruPruPru back here!
          <br/>
          We're halfway. Are you able to stay in the VIP area?"
        />
      </Surface>
    );
  }

  return (
    <Surface contained>
      <Translate
        pt="Última rodada! Ganha quem estiver na área VIP com mais pontos!
        <br/>
        Será que será você?"
        en="It's the last round! The player with the most points in the VIP area will win!
        <br/>
        Will that be you?"
      />
    </Surface>
  );
}
