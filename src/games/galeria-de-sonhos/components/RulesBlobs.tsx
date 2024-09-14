// Types
import type { GameRound } from 'types/game';
import type { GamePlayer } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { BotHighlight } from 'components/metrics/BotHighlight';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { PlayerHighlight } from 'components/metrics/PlayerHighlight';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Instruction, RuleInstruction } from 'components/text';

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

export function DreamSelectionRules({ contained = false, hardModeEnabled = false }) {
  const minimumDreams = hardModeEnabled ? 4 : 1;

  const rules = (
    <Translate
      pt={
        <>
          Selecione sonhos (cartas) que você acha que se relacionam com a palavra-tema da rodada.
          <br />
          Você deve selecionar pelo menos <CardHighlight>{minimumDreams}</CardHighlight> e no máximo{' '}
          <CardHighlight>10</CardHighlight>.
        </>
      }
      en={
        <>
          Now select cards that you think match the round's card.
          <br />
          You must select at least <CardHighlight>{minimumDreams}</CardHighlight> card and a maximum of{' '}
          <CardHighlight>10</CardHighlight>.
        </>
      }
    />
  );

  if (contained) {
    return <RuleInstruction type="action">{rules}</RuleInstruction>;
  }

  return <Instruction>{rules}</Instruction>;
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
    <Instruction>
      <Translate
        pt={
          <>
            De um em um, cada jogador vai escolher um de seus sonhos visitados se você ainda tem algum
            disponível.
            <br />
            Selecione o sonho que você mais acha que tem chance de outro jogador ter também visitado.
            <br />
            Você ganha <PointsHighlight type="positive">3</PointsHighlight> pontos se apenas mais{' '}
            <PlayerHighlight>1</PlayerHighlight> jogador visitou o mesmo sonho.
            <br />
            Você ganha <PointsHighlight type="positive">2</PointsHighlight> pontos se mais de{' '}
            <PlayersHighlight>1+</PlayersHighlight> jogador visitou o mesmo sonho.
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
            You get <PointsHighlight type="positive">3</PointsHighlight> points if only{' '}
            <PlayerHighlight>1</PlayerHighlight> player visited the same dream.
            <br />
            You get <PointsHighlight type="positive">2</PointsHighlight> points if many{' '}
            <PlayersHighlight>1+</PlayersHighlight> players have visited the same dream.
            <br />
            You are eliminated for this round if nobody else has visited the chosen dream.
          </>
        }
      />
    </Instruction>
  );
}

export function BotsRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Em um jogo com bots, <BotHighlight>3</BotHighlight> jogadores-robôs são adicionados ao jogo.
            <br />
            Antes da fase do Bingo dos Sonhos, os três bots entram em ação e selecionam cartas segundo se
            seguinte lógica:
            <br />
            O bot A seleciona todas as cartas que foram mais selecionadas pelos jogadores.
            <br />
            O bot B seleciona cartas que foram selecionadas por apenas um jogador, mas apenas uma por jogador,
            e somente se mais de um jogador tiver essa carta extra.
            <br />O bot C simplesmente seleciona 4 cartas aleatórias.
          </>
        }
        en={
          <>
            In a game with bots, the <BotHighlight>3</BotHighlight> bots are added to the game.
            <br />
            Before the Dream Bingo phase, the three bots select cards based on a pre-determined logic:
            <br />
            Bot A select all most visited cards.
            <br />
            Bot B select all cards that got a single player visiting them but only one per player and only if
            more than one player will have a match this way.
            <br />
            Bot C simply selects 4 random cards.
          </>
        }
      />
    </Instruction>
  );
}

type DreamSelectionRulesProps = {
  round: GameRound;
};

export function RowSwapInstruction({ round }: DreamSelectionRulesProps) {
  const changedRows: Record<string, DualLanguageValue> = {
    1: {
      pt: '3ª',
      en: '3rd',
    },
    2: {
      pt: '2ª',
      en: '2nd',
    },
    3: {
      pt: '1ª',
      en: '1st',
    },
  };

  if (round.current > 3) {
    return <></>;
  }

  return (
    <RuleInstruction type="event">
      <Translate
        pt={
          <>
            <strong>Atenção!</strong> A <DualTranslate>{changedRows[round.current]}</DualTranslate> linha de
            cartas sera trocada para a próxima rodada.
          </>
        }
        en={
          <>
            <strong>Attention!</strong> The <DualTranslate>{changedRows[round.current]}</DualTranslate> row of
            cards will be swapped for the next round.
          </>
        }
      />
    </RuleInstruction>
  );
}
