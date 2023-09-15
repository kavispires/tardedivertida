// Components
import { FallbackComponent } from './FallbackComponent';
import { ResultArteRuim } from './Results/ResultArteRuim';
import { ResultCruzaPalavras } from './Results/ResultCruzaPalavras';
import { ResultNamoroOuAmizade } from './Results/ResultNamoroOuAmizade';
import { ResultNaRuaDoMedo } from './Results/ResultNaRuaDoMedo';
import { ResultRetratoFalado } from './Results/ResultRetratoFalado';
import { ResultVamosAoCinema } from './Results/ResultVamosNoCinema';
import { ResultMegamix } from './Results/ResultMegamix';
import { ResultImage } from './Results/ResultImage';
import { ResultText } from './Results/ResultText';
import { ResultCharacter } from './Results/ResultCharacter';
import { WinningCount } from './WinningCount';
import { ResultOndaTelepatica } from './Results/ResultOndaTelepatica';

export const ResultValueDelegator = (props: ResultComponentProps) => {
  const ResultComponent =
    {
      'arte-ruim': ResultArteRuim,
      'comunicacao-alienigena': FallbackComponent,
      'contadores-historias': ResultImage,
      'crimes-hediondos': ResultImage,
      'cruza-palavras': ResultCruzaPalavras,
      'dilema-dos-esquiadores': ResultText,
      'detetives-imaginativos': ResultImage,
      'espiao-entre-nos': ResultText,
      'fileira-de-fatos': FallbackComponent,
      'galeria-de-sonhos': ResultImage,
      'labirinto-secreto': FallbackComponent,
      'megamix-best-of-three': ResultMegamix,
      'megamix-this-that': ResultMegamix,
      'mente-coletiva': FallbackComponent,
      'namoro-ou-amizade': ResultNamoroOuAmizade,
      'na-rua-do-medo': ResultNaRuaDoMedo,
      'onda-telepatica': ResultOndaTelepatica,
      'palheta-de-cores': FallbackComponent,
      'polemica-da-vez': ResultText,
      'porta-dos-desesperados': ResultImage,
      'quem-nao-mata': FallbackComponent,
      'quem-sou-eu': ResultCharacter,
      'retrato-falado': ResultRetratoFalado,
      'super-campeonato': ResultCharacter,
      'testemunha-ocular': ResultImage,
      'ta-na-cara': FallbackComponent,
      'ue-so-isso': FallbackComponent,
      'vamos-ao-cinema': ResultVamosAoCinema,
    }?.[props.track.game] ?? FallbackComponent;

  return (
    <>
      <WinningCount winners={props.winningTeam.length} total={props.playersList.length} />
      <ResultComponent {...props} />
    </>
  );
};
