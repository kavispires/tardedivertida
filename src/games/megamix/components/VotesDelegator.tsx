import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Internal
import type { VoteComponentProps } from '../utils/types';
import { FallbackComponent } from './FallbackComponent';
import { VoteArteRuim } from './Votes/VoteArteRuim';
import { VoteCruzaPalavras } from './Votes/VoteCruzaPalavras';
import { VoteNamoroOuAmizade } from './Votes/VoteNamoroOuAmizade';
import { VoteNaRuaDoMedo } from './Votes/VoteNaRuaDoMedo';
import { VoteRetratoFalado } from './Votes/VoteRetratoFalado';
import { VoteVamosAoCinema } from './Votes/VoteVamosAoCinema';
import { VoteMegamix } from './Votes/VoteMegamix';
import { VoteImagesTrack } from './Votes/VoteImagesTrack';
import { VoteValue } from './Votes/VoteValue';
import { VoteOndaTelepatica } from './Votes/VoteOndaTelepatica';
import { VoteCharacterTrack } from './Votes/VoteCharacterTrack';
import { VotePalhetaDeCores } from './Votes/VotePalhetaDeCores';
import { VoteQuemNaoMata } from './Votes/VoteQuemNaoMata';
import { VoteComunicacaoAlienigena } from './Votes/VoteComunicacaoAlienigena';
import { VoteTaNaCara } from './Votes/VoteTaNaCara';
import { VoteLabirintoSecreto } from './Votes/VoteLabirintoSecreto';
import { VoteWhoSaidThis } from './Votes/VoteWhoSaidThis';
import { VoteCrimesHediondos } from './Votes/VoteCrimesHediondos';
// Type

export const VotesDelegator = (props: Omit<VoteComponentProps, 'playersList'>) => {
  const playersList = useMemo(
    () => orderBy(Object.values(props.players), ['data.value', 'name'], ['asc', 'asc']),
    [props.players],
  );

  const VotesComponent =
    {
      'arte-ruim': VoteArteRuim,
      'comunicacao-alienigena': VoteComunicacaoAlienigena,
      'contadores-historias': VoteImagesTrack,
      'crimes-hediondos': VoteCrimesHediondos,
      'cruza-palavras': VoteCruzaPalavras,
      'detetives-imaginativos': VoteImagesTrack,
      esquiadores: VoteValue,
      'espiao-entre-nos': VoteValue,
      'fileira-de-fatos': VoteValue,
      'galeria-de-sonhos': VoteImagesTrack,
      'labirinto-secreto': VoteLabirintoSecreto,
      'megamix-best-of-three': VoteMegamix,
      'megamix-this-that': VoteMegamix,
      'megamix-who-said-this': VoteWhoSaidThis,
      'mente-coletiva': VoteValue,
      'namoro-ou-amizade': VoteNamoroOuAmizade,
      'na-rua-do-medo': VoteNaRuaDoMedo,
      'onda-telepatica': VoteOndaTelepatica,
      'palheta-de-cores': VotePalhetaDeCores,
      'polemica-da-vez': VoteValue,
      'porta-dos-desesperados': VoteImagesTrack,
      'quem-nao-mata': VoteQuemNaoMata,
      'quem-sou-eu': VoteCharacterTrack,
      'retrato-falado': VoteRetratoFalado,
      'super-campeonato': VoteCharacterTrack,
      'ta-na-cara': VoteTaNaCara,
      'testemunha-ocular': VoteImagesTrack,
      'ue-so-isso': VoteValue,
      'vamos-ao-cinema': VoteVamosAoCinema,
    }?.[props.track.game] ?? FallbackComponent;

  return <VotesComponent {...props} playersList={playersList} />;
};
