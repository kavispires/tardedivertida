import A from 'games/arte-ruim/game-info.json';
import B from 'games/bomba-relogio/game-info.json';
import C from 'games/contadores-historias/game-info.json';
import D from 'games/detetives-imaginativos/game-info.json';
import E from 'games/espiao-entre-nos/game-info.json';
import G from 'games/galeria-de-sonhos/game-info.json';
import H from 'games/crimes-hediondos/game-info.json';
import I from 'games/instrumentos-codificados/game-info.json';
import K from 'games/palheta-de-cores/game-info.json';
import L from 'games/linhas-cruzadas/game-info.json';
import M from 'games/mente-coletiva/game-info.json';
import N from 'games/na-rua-do-medo/game-info.json';
import O from 'games/onda-telepatica/game-info.json';
import P from 'games/polemica-da-vez/game-info.json';
import Q from 'games/quem-nao-mata/game-info.json';
import R from 'games/retrato-falado/game-info.json';
import S from 'games/sonhos-pesadelos/game-info.json';
import T from 'games/testemunha-ocular/game-info.json';
import U from 'games/ue-so-isso/game-info.json';
import V from 'games/vendaval-de-palpite/game-info.json';
import W from 'games/super-campeonato/game-info.json';
import X from 'games/cruza-palavras/game-info.json';
import Y from 'games/trevo-da-sorte/game-info.json';

import comingSoonGames from 'assets/data/coming-soon-games.json';

const others = comingSoonGames as Record<GameCode, GameInfo>;

export const GAME_LIST: Record<GameCode, GameInfo> = {
  ...others,
  A,
  B,
  C,
  D,
  E,
  G,
  H,
  I,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
};

export default GAME_LIST;
