// Components
import { Step } from 'components/steps';
import { ClubLine } from './components/ClubLine';
import { TrackArteRuim } from './components/Tracks/TrackArteRuim';
import { TrackCaminhosMagicos } from './components/Tracks/TrackCaminhosMagicos';
import { TrackContadoresHistorias } from './components/Tracks/TrackContadoresHistorias';
import { TrackCrimesHediondos } from './components/Tracks/TrackCrimesHediondos';
import { TrackCruzaPalavras } from './components/Tracks/TrackCruzaPalavras';
import { TrackDetetivesImaginativos } from './components/Tracks/TrackDetetivesImaginativos';
import { TrackDilemaDosEsquiadores } from './components/Tracks/TrackDilemaDosEsquiadores';
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

type StepTrackProps = {
  round: GameRound;
  track: Track;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitAnswer: GenericFunction;
} & AnnouncementProps;

export const StepTrack = ({ announcement, ...rest }: StepTrackProps) => {
  const Component =
    {
      'arte-ruim': TrackArteRuim,
      'caminhos-magicos': TrackCaminhosMagicos,
      'contadores-historias': TrackContadoresHistorias,
      'crimes-hediondos': TrackCrimesHediondos,
      'cruza-palavras': TrackCruzaPalavras,
      'dilema-dos-esquiadores': TrackDilemaDosEsquiadores,
      'detetives-imaginativos': TrackDetetivesImaginativos,
      'espiao-entre-nos': TrackEspiaoEntreNos,
      'fileira-de-fatos': TrackFileiraDeFatos,
      'galeria-de-sonhos': TrackGaleriaDeSonhos,
      'megamix-best-of-three': TrackMegamixBestOfThree,
      'megamix-this-that': TrackMegamixThisThat,
      'mente-coletiva': TrackMenteColetiva,
      'namoro-ou-amizade': TrackNamoroOuAmizade,
      'na-rua-do-medo': TrackNaRuaDoMedo,
      'onda-telepatica': TrackOndaTelepatica,
      'palheta-de-cores': TrackPalhetaDeCores,
      'polemica-da-vez': TrackPolemicaDaVez,
      'porta-dos-desesperados': TrackPortaDosDesesperados,
      'quem-nao-mata': TrackQuemNaoMata,
      'retrato-falado': TrackRetratoFalado,
      'super-campeonato': TrackSuperCampeonato,
      'testemunha-ocular': TrackTestemunhaOcular,
      'ue-so-isso': TrackUeSoIsso,
      'vamos-ao-cinema': TrackVamosAoCinema,
    }?.[rest.track.game] ?? FallbackComponent;

  return (
    <Step fullWidth announcement={announcement}>
      <Component {...rest} />
      <ClubLine players={rest.players} currentRound={rest.round.current} />
    </Step>
  );
};

const FallbackComponent = (_: TrackProps) => {
  return <div>Something wrong is not right</div>;
};
