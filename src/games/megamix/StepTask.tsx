// Components
import { Step } from 'components/steps';
import { ClubLine } from './components/ClubLine';
import { TaskArteRuim } from './components/TaskArteRuim';
import { TaskCaminhosMagicos } from './components/TaskCaminhosMagicos';
import { TaskContadoresHistorias } from './components/TaskContadoresHistorias';
import { TaskCrimesHediondos } from './components/TaskCrimesHediondos';
import { TaskCruzaPalavras } from './components/TaskCruzaPalavras';
import { TaskDetetivesImaginativos } from './components/TaskDetetivesImaginativos';
import { TaskDilemaDosEsquiadores } from './components/TaskDilemaDosEsquiadores';
import { TaskEspiaoEntreNos } from './components/TaskEspiaoEntreNos';
import { TaskFileiraDeFatos } from './components/TaskFileiraDeFatos';
import { TaskGaleriaDeSonhos } from './components/TaskGaleriaDeSonhos';
import { TaskMenteColetiva } from './components/TaskMenteColetiva';
import { TaskNamoroOuAmizade } from './components/TaskNamoroOuAmizade';
import { TaskNaRuaDoMedo } from './components/TaskNaRuaDoMedo';
import { TaskOndaTelepatica } from './components/TaskOndaTelepatica';
import { TaskPalhetaDeCores } from './components/TaskPalhetaDeFores';
import { TaskPolemicaDaVez } from './components/TaskPolemicaDaVez';
import { TaskPortaDosDesesperados } from './components/TaskPortaDosDesesperados';
import { TaskQuemNaoMata } from './components/TaskQuemNaoMata';
import { TaskRetratoFalado } from './components/TaskRetratoFalado';
import { TaskSuperCampeonato } from './components/TaskSuperCampeonato';
import { TaskTestemunhaOcular } from './components/TaskTestemunhaOcular';
import { TaskUeSoIsso } from './components/TaskUeSoIsso';
import { TaskVamosAoCinema } from './components/TaskVamosAoCinema';

type StepTaskProps = {
  round: GameRound;
  task: Task;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitTask: GenericFunction;
} & AnnouncementProps;

export const StepTask = ({ announcement, ...rest }: StepTaskProps) => {
  let Component = FallbackComponent;

  switch (rest.task.game) {
    case 'arte-ruim':
      Component = TaskArteRuim;
      break;
    case 'caminhos-magicos':
      Component = TaskCaminhosMagicos;
      break;
    case 'contadores-historias':
      Component = TaskContadoresHistorias;
      break;
    case 'crimes-hediondos':
      Component = TaskCrimesHediondos;
      break;
    case 'cruza-palavras':
      Component = TaskCruzaPalavras;
      break;
    case 'dilema-dos-esquiadores':
      Component = TaskDilemaDosEsquiadores;
      break;
    case 'detetives-imaginativos':
      Component = TaskDetetivesImaginativos;
      break;
    case 'espiao-entre-nos':
      Component = TaskEspiaoEntreNos;
      break;
    case 'fileira-de-fatos':
      Component = TaskFileiraDeFatos;
      break;
    case 'galeria-de-sonhos':
      Component = TaskGaleriaDeSonhos;
      break;
    case 'mente-coletiva':
      Component = TaskMenteColetiva;
      break;
    case 'namoro-ou-amizade':
      Component = TaskNamoroOuAmizade;
      break;
    case 'na-rua-do-medo':
      Component = TaskNaRuaDoMedo;
      break;
    case 'onda-telepatica':
      Component = TaskOndaTelepatica;
      break;
    case 'palheta-de-cores':
      Component = TaskPalhetaDeCores;
      break;
    case 'polemica-da-vez':
      Component = TaskPolemicaDaVez;
      break;
    case 'porta-dos-desesperados':
      Component = TaskPortaDosDesesperados;
      break;
    case 'quem-nao-mata':
      Component = TaskQuemNaoMata;
      break;
    case 'retrato-falado':
      Component = TaskRetratoFalado;
      break;
    case 'super-campeonato':
      Component = TaskSuperCampeonato;
      break;
    case 'testemunha-ocular':
      Component = TaskTestemunhaOcular;
      break;
    case 'ue-so-isso':
      Component = TaskUeSoIsso;
      break;
    case 'vamos-ao-cinema':
      Component = TaskVamosAoCinema;
      break;
    default:
      Component = FallbackComponent;
  }

  return (
    <Step fullWidth announcement={announcement}>
      <Component {...rest} />
      <ClubLine players={rest.players} currentRound={rest.round.current} />
    </Step>
  );
};

const FallbackComponent = (_: TaskProps) => {
  return <div>Something wrong is not right</div>;
};
