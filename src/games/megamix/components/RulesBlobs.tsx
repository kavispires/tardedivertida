// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

type DJInstructionsProps = {
  round: GameRound;
};

export function DJInstructions({ round }: DJInstructionsProps) {
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
          Ao responder com a maioria, você ganha {joinPoints} por entrar na área VIP ou {stayPoints} se você já estiver lá.
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

  if (round.current === Math.ceil(round.total / 2)) {
    return (
      <Surface contained>
        <Translate
          pt="DJ PruPruPru está de volta! Estamos no meio da noite!
          <br/>
          Plot twist: a partir de agora, se você for o jogador com mais pontos e tiver que sair da área VIP, você perde {catchupPenalty}!
          <br/>
          Mas se você for o jogador com menos pontos e conseguir entrar na área VIP, você ganha {catchupBonus}!"
          en="DJ PruPruPru back here! We're halfway through the night.
          <br/>
          Plot twist: from now on, if you're the player with the most points and you have to leave the VIP area, you lose {catchupPenalty}!
          <br/>
          But if you're the player with the least points and you manage to enter the VIP area, you gain {catchupBonus}!"
          values={{
            catchupPenalty: (
              <PointsHighlight
                type="negative"
                value={2}
              />
            ),
            catchupBonus: (
              <PointsHighlight
                type="positive"
                value={2}
                bonus
              />
            ),
          }}
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
