// Types
import type { GameRound, GamePlayer } from 'types/game';
// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { BotHighlight } from '@components/metrics/BotHighlight';
import { CardHighlight } from '@components/metrics/CardHighlight';
import { PlayerHighlight } from '@components/metrics/PlayerHighlight';
import { PlayersHighlight } from '@components/metrics/PlayersHighlight';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RuleInstruction } from '@components/text/RuleInstruction';

type WordSelectionRulesProps = {
  scout: GamePlayer;
};

export function WordSelectionRules({ scout }: WordSelectionRulesProps) {
  return (
    <Surface>
      <Translate
        pt="Cada rodada tem seu tema... uma palavra.<br/>Para essa rodada, {scout} escolherá o tema."
        en="Every round has a theme... a word.<br/>For this round, {scout} will choose the theme."
        values={{
          scout: (
            <PlayerAvatarName
              player={scout}
              addressUser
              size="small"
            />
          ),
        }}
      />
    </Surface>
  );
}

export function GeneralRules() {
  return (
    <Surface contained>
      <Translate
        pt="Somos caçadores de sonhos!<br/>Dentro do tema escolhido, podemos visitar os sonhos de até 10 das 15 pessoas (cartas-imagens) disponíveis.<br/>O objetivo é encontrar uns aos outros em cada sonho, então escolha apenas sonhos que você acredita que outros jogadores também irão escolher.<br/>Parece fácil, mas se você escolher um sonho que ninguém mais escolheu... vixi..."
        en="We are dream scouts!<br/>Given the chosen theme, we can visit dreams of 10 of the 15 people (image cards) available.<br/>The goal of the game is to match the same visited dreams of other players, therefore choose dreams that you think other players will also choose.<br/>It seems easy, but if you choose a dream that nobody else has chosen... well..."
      />
    </Surface>
  );
}

export function DreamSelectionRules({ contained = false, minimumSelection = 1 }) {
  const rules = (
    <Translate
      pt={`Selecione sonhos (cartas) que você acha que se relacionam com a palavra-tema da rodada.${minimumSelection > 1 ? '<br/>Uau! No modo surpresa, o mínimo de cartas é bem maior!' : ''}<br/>Você deve selecionar pelo menos {minimumSelection} e no máximo {maximumSelection}.`}
      en={`Now select dreams (cards) that you think match the round's theme.${minimumSelection > 1 ? '<br/>Wow! In the surprise mode, the minimum selection is much higher!' : ''}<br/>You must select at least {minimumSelection} card and a maximum of {maximumSelection}.`}
      values={{
        minimumSelection: <CardHighlight>{minimumSelection}</CardHighlight>,
        maximumSelection: <CardHighlight>10</CardHighlight>,
      }}
    />
  );

  if (contained) {
    return <RuleInstruction type="action">{rules}</RuleInstruction>;
  }

  return <Surface>{rules}</Surface>;
}

export function DreamSelectionExtendedRules() {
  return (
    <Surface contained>
      <Translate
        pt="Na próxima fase, de um a um, cada jogador vai escolher um de seus sonhos visitados.<br/>Se pelo menos um jogador visitou o mesmo sonho, eles ganham pontos. Se ninguém escolheu, o jogador está fora da rodada!<br/>Dai passa-se a vez para o próximo jogador!<br/>Sonhos só podem ser escolhidos uma vez por rodada..."
        en="On the next phase, one by one, each player will select one of their visited dreams.<br/>If at least one other player visited the same dream, they get points! If nobody visited the same dream, you are out of the round!<br/>Each dream can be chosen once per round only..."
      />
    </Surface>
  );
}

export function CardPlayRules() {
  return (
    <Surface>
      <Translate
        pt="De um em um, cada jogador vai escolher um de seus sonhos visitados se você ainda tem algum disponível.<br/>Selecione o sonho que você mais acha que tem chance de outro jogador ter também visitado.<br/>Você ganha {points3} se apenas mais {onePlayer} jogador visitou o mesmo sonho.<br/>Você ganha {points2} se mais de {manyPlayers} jogador visitou o mesmo sonho.<br/>Você está eliminado da rodada se ninguém mais visitou o sonho escolhido (mas você volta para a próxima rodada!)"
        en="One by one, each player chooses one of their visited dreams, if you have any still available.<br/>Select the dream you think you have the most chances of matching another player.<br/>You get {points3} if only {onePlayer} player visited the same dream.<br/>You get {points2} if many {manyPlayers} players have visited the same dream.<br/>You are eliminated from this round if nobody else has visited the chosen dream. (but you will be back for the next round!)"
        values={{
          points3: (
            <PointsHighlight
              type="positive"
              value={3}
            />
          ),
          points2: (
            <PointsHighlight
              type="positive"
              value={2}
            />
          ),
          onePlayer: <PlayerHighlight>1</PlayerHighlight>,
          manyPlayers: <PlayersHighlight>1+</PlayersHighlight>,
        }}
      />
    </Surface>
  );
}

export function BotsRules() {
  return (
    <Surface contained>
      <Translate
        pt="Em um jogo com bots, {botCount} jogadores-robôs são adicionados ao jogo.<br/>Antes da fase do Bingo dos Sonhos, os três bots entram em ação e selecionam cartas segundo se seguinte lógica:<br/>O bot A seleciona todas as cartas que foram mais selecionadas pelos jogadores.<br/>O bot B seleciona cartas que foram selecionadas por apenas um jogador, mas apenas uma por jogador, e somente se mais de um jogador tiver essa carta extra.<br/>O bot C simplesmente seleciona 4 cartas aleatórias."
        en="In a game with bots, the {botCount} bots are added to the game.<br/>Before the Dream Bingo phase, the three bots select cards based on a pre-determined logic:<br/>Bot A select all most visited cards.<br/>Bot B select all cards that got a single player visiting them but only one per player and only if more than one player will have a match this way.<br/>Bot C simply selects 4 random cards."
        values={{ botCount: <BotHighlight>3</BotHighlight> }}
      />
    </Surface>
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
    return null;
  }

  return (
    <RuleInstruction type="event">
      <Translate
        pt="<strong>Atenção!</strong> A {row} linha de cartas sera trocada para a próxima rodada."
        en="<strong>Attention!</strong> The {row} row of cards will be swapped for the next round."
        values={{ row: <DualTranslate>{changedRows[round.current]}</DualTranslate> }}
      />
    </RuleInstruction>
  );
}
