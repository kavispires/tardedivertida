// Components
import { WinningCount } from './WinningCount';
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
import { ResultOndaTelepatica } from './Results/ResultOndaTelepatica';
import { ResultComunicacaoAlienigena } from './Results/ResultComunicacaoAlienigena';
import { ResultTaNaCara } from './Results/ResultTaNaCara';
import { ResultLabirintoSecreto } from './Results/ResultLabirintoSecreto';
import { ResultPalhetaDeCores } from './Results/ResultPalhetaDeCores';
import { ResultQuemNaoMata } from './Results/ResultQuemNaoMata';

export const ResultValueDelegator = (props: ResultComponentProps) => {
  const ResultComponent =
    {
      'arte-ruim': ResultArteRuim,
      'comunicacao-alienigena': ResultComunicacaoAlienigena,
      'contadores-historias': ResultImage,
      'crimes-hediondos': ResultImage,
      'cruza-palavras': ResultCruzaPalavras,
      'detetives-imaginativos': ResultImage,
      'dilema-dos-esquiadores': ResultText,
      'espiao-entre-nos': ResultText,
      'fileira-de-fatos': ResultText,
      'galeria-de-sonhos': ResultImage,
      'labirinto-secreto': ResultLabirintoSecreto,
      'megamix-best-of-three': ResultMegamix,
      'megamix-this-that': ResultMegamix,
      'mente-coletiva': ResultText,
      'namoro-ou-amizade': ResultNamoroOuAmizade,
      'na-rua-do-medo': ResultNaRuaDoMedo,
      'onda-telepatica': ResultOndaTelepatica,
      'palheta-de-cores': ResultPalhetaDeCores,
      'polemica-da-vez': ResultText,
      'porta-dos-desesperados': ResultImage,
      'quem-nao-mata': ResultQuemNaoMata,
      'quem-sou-eu': ResultCharacter,
      'retrato-falado': ResultRetratoFalado,
      'super-campeonato': ResultCharacter,
      'testemunha-ocular': ResultImage,
      'ta-na-cara': ResultTaNaCara,
      'ue-so-isso': ResultText,
      'vamos-ao-cinema': ResultVamosAoCinema,
    }?.[props.track.game] ?? FallbackComponent;

  return (
    <>
      <WinningCount winners={props.winningTeam.length} total={props.playersList.length} />
      <ResultComponent {...props} />
    </>
  );
};
