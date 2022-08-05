import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

type WordSelectionRulesProps = {
  scout: GamePlayer;
};

export function WordSelectionRules({ scout }: WordSelectionRulesProps) {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Cada rodada tem seu tema... uma palavra.
            <br />
            Para essa rodada, <AvatarName player={scout} addressUser size="small" /> escolherá o tema.
          </>
        }
        en={
          <>
            Every round has a theme... a word.
            <br />
            For this round,
            <AvatarName player={scout} addressUser size="small" /> will choose the theme.
          </>
        }
      />
    </Instruction>
  );
}

export function GeneralRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Somos caçadores de sonhos!
            <br />
            Dentro do tema escolhido, podemos visitar os sonhos de até 10 das 15 pessoas (cartas-imagens)
            disponíveis.
            <br />
            O objetivo é encontrar uns aos outros em cada sonho, então escolha apenas sonhos que você acredita
            que outros jogadores também irão escolher.
            <br />
            Parece fácil, mas se você escolher um sonho que ninguém mais escolheu... vixi...
          </>
        }
        en={
          <>
            We are dream scouts!
            <br />
            Given the chosen theme, we can visit dreams of 10 of the 15 people (image cards) available.
            <br />
            The goal of the game is to match the same visited dreams of other players, therefore choose dreams
            that you think other players will also choose.
            <br />
            It seems easy, but if you choose a dream that nobody else has chosen... well...
          </>
        }
      />
    </Instruction>
  );
}

export function DreamSelectionRules({ contained = false }) {
  return (
    <Instruction contained={contained}>
      <Translate
        pt={
          <>
            Selecione sonhos (cartas) que você acha que se relacionam com a palavra-tema da rodada.
            <br />
            Você deve selecionar pelo menos 1 e no máximo 10.
          </>
        }
        en={
          <>
            Now select cards that you think match the round's card.
            <br />
            You must select at least 1 card and a maximum of 10.
          </>
        }
      />
    </Instruction>
  );
}

export function DreamSelectionExtendedRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Na próxima fase, de um a um, cada jogador vai escolher um de seus sonhos visitados.
            <br />
            Se pelo menos um jogador visitou o mesmo sonho, eles ganham pontos. Se ninguém escolheu, o jogador
            está fora da rodada!
            <br />
            Dai passa-se a vez para o próximo jogador!
            <br />
            Sonhos só podem ser escolhidos uma vez por rodada...
          </>
        }
        en={
          <>
            On the next phase, one by one, each player will select one of their visited dreams.
            <br />
            If at least one other player visited the same dream, they get points! If nobody visited the same
            dream, you are out of the round!
            <br />
            Each dream can be chosen once per round only...
          </>
        }
      />
    </Instruction>
  );
}

export function CardPlayRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            De um em um, cada jogador vai escolher um de seus sonhos visitados se você ainda tem algum
            disponível.
            <br />
            Selecione o sonho que você mais acha que tem chance de outro jogador ter também visitado.
            <br />
            Você ganha 3 pontos se apenas mais 1 jogador visitou o mesmo sonho.
            <br />
            Você ganha 2 pontos se mais de 1 jogador visitou o mesmo sonho.
            <br />
            Você está eliminado da rodada se ninguém mais visitou o sonho escolhido.
          </>
        }
        en={
          <>
            One by one, each player chooses one of their visited dreams, if you have any still available.
            <br />
            Select the dream you think you have the most chances of matching another player.
            <br />
            You get 3 points if only 1 player visited the same dream.
            <br />
            You get 2 points if many players have visited the same dream.
            <br />
            You are eliminated for this round if nobody else has visited the chosen dream.
          </>
        }
      />
    </Instruction>
  );
}
