// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { Step, type StepProps } from 'components/steps';
// Internal
import type { SubmitAnswerPayload, Track } from './utils/types';
import { ClubLine } from './components/ClubLine';
import { FallbackComponent } from './components/FallbackComponent';
import { TrackArteRuim } from './components/Tracks/TrackArteRuim';
import { TrackLabirintoSecreto } from './components/Tracks/TrackLabirintoSecreto';
import { TrackContadoresHistorias } from './components/Tracks/TrackContadoresHistorias';
import { TrackCrimesHediondos } from './components/Tracks/TrackCrimesHediondos';
import { TrackCruzaPalavras } from './components/Tracks/TrackCruzaPalavras';
import { TrackDetetivesImaginativos } from './components/Tracks/TrackDetetivesImaginativos';
import { TrackEsquiadores } from './components/Tracks/TrackEsquiadores';
import { TrackEspiaoEntreNos } from './components/Tracks/TrackEspiaoEntreNos';
import { TrackFileiraDeFatos } from './components/Tracks/TrackFileiraDeFatos';
import { TrackGaleriaDeSonhos } from './components/Tracks/TrackGaleriaDeSonhos';
import { TrackMenteColetiva } from './components/Tracks/TrackMenteColetiva';
import { TrackNamoroOuAmizade } from './components/Tracks/TrackNamoroOuAmizade';
import { TrackNaRuaDoMedo } from './components/Tracks/TrackNaRuaDoMedo';
import { TrackOndaTelepatica } from './components/Tracks/TrackOndaTelepatica';
import { TrackPalhetaDeCores } from './components/Tracks/TrackPalhetaDeFores';
import { TrackPolemicaDaVez } from './components/Tracks/TrackPolemicaDaVez';
import { TrackPortaDosDesesperados } from './components/Tracks/TrackPortaDosDesesperados';
import { TrackQuemNaoMata } from './components/Tracks/TrackQuemNaoMata';
import { TrackRetratoFalado } from './components/Tracks/TrackRetratoFalado';
import { TrackSuperCampeonato } from './components/Tracks/TrackSuperCampeonato';
import { TrackTestemunhaOcular } from './components/Tracks/TrackTestemunhaOcular';
import { TrackUeSoIsso } from './components/Tracks/TrackUeSoIsso';
import { TrackVamosAoCinema } from './components/Tracks/TrackVamosAoCinema';
import { TrackMegamixBestOfThree } from './components/Tracks/TrackMegamixBestOfThree';
import { TrackMegamixThisThat } from './components/Tracks/TrackMegamixThisThat';
import { TrackComunicacaoAlienigena } from './components/Tracks/TrackComunicacaoAlienigena';
import { TrackQuemSouEu } from './components/Tracks/TrackQuemSouEu';
import { TrackTaNaCara } from './components/Tracks/TrackTaNaCara';
import { TrackMegamixWhoSaidThis } from './components/Tracks/TrackMegamixWhoSaidThis';

type StepTrackProps = {
  round: GameRound;
  track: Track;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitAnswer: (payload: SubmitAnswerPayload) => void;
} & Pick<StepProps, 'announcement'>;

export const StepTrack = ({ announcement, ...rest }: StepTrackProps) => {
  const TrackComponent =
    {
      'arte-ruim': TrackArteRuim,
      'comunicacao-alienigena': TrackComunicacaoAlienigena,
      'contadores-historias': TrackContadoresHistorias,
      'crimes-hediondos': TrackCrimesHediondos,
      'cruza-palavras': TrackCruzaPalavras,
      'detetives-imaginativos': TrackDetetivesImaginativos,
      esquiadores: TrackEsquiadores,
      'espiao-entre-nos': TrackEspiaoEntreNos,
      'fileira-de-fatos': TrackFileiraDeFatos,
      'galeria-de-sonhos': TrackGaleriaDeSonhos,
      'labirinto-secreto': TrackLabirintoSecreto,
      'megamix-best-of-three': TrackMegamixBestOfThree,
      'megamix-this-that': TrackMegamixThisThat,
      'megamix-who-said-this': TrackMegamixWhoSaidThis,
      'mente-coletiva': TrackMenteColetiva,
      'namoro-ou-amizade': TrackNamoroOuAmizade,
      'na-rua-do-medo': TrackNaRuaDoMedo,
      'onda-telepatica': TrackOndaTelepatica,
      'palheta-de-cores': TrackPalhetaDeCores,
      'polemica-da-vez': TrackPolemicaDaVez,
      'porta-dos-desesperados': TrackPortaDosDesesperados,
      'quem-nao-mata': TrackQuemNaoMata,
      'quem-sou-eu': TrackQuemSouEu,
      'retrato-falado': TrackRetratoFalado,
      'super-campeonato': TrackSuperCampeonato,
      'testemunha-ocular': TrackTestemunhaOcular,
      'ta-na-cara': TrackTaNaCara,
      'ue-so-isso': TrackUeSoIsso,
      'vamos-ao-cinema': TrackVamosAoCinema,
    }?.[rest.track.game] ?? FallbackComponent;

  return (
    <Step fullWidth announcement={announcement}>
      <TrackComponent {...rest} />
      <ClubLine players={rest.players} currentRound={rest.round.current} />
    </Step>
  );
};
