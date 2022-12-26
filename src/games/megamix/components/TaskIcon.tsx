import { BoxingGlovesIcon } from 'components/icons/BoxingGlovesIcon';
import { ColorWheelIcon } from 'components/icons/ColorWheelIcon';
import { CrimeSceneIcon } from 'components/icons/CrimeSceneIcon';
import { CriminalIcon } from 'components/icons/CriminalIcon';
import { CrossWordsIcon } from 'components/icons/CrossWordsIcon';
import { DetectiveIcon } from 'components/icons/DetectiveIcon';
import { DreamIcon } from 'components/icons/DreamIcon';
import { FairyTaleIcon } from 'components/icons/FairyTaleIcon';
import { GuessIcon } from 'components/icons/GuessIcon';
import { LoveIcon } from 'components/icons/LoveIcon';
import { MagicDoorIcon } from 'components/icons/MagicDoorIcon';
import { MonsterIcon } from 'components/icons/MonsterIcon';
import { MovieTheaterIcon } from 'components/icons/MovieTheaterIcon';
import { PassportIcon } from 'components/icons/PassportIcon';
import { PathIcon } from 'components/icons/PathIcon';
import { PictureIcon } from 'components/icons/PictureIcon';
import { QueueIcon } from 'components/icons/QueueIcon';
import { RevolverIcon } from 'components/icons/RevolverIcon';
import { SheepIcon } from 'components/icons/SheepIcon';
import { SkiingIcon } from 'components/icons/SkiingIcon';
import { TDIcon } from 'components/icons/TDIcon';
import { TrendingIcon } from 'components/icons/TrendingIcon';
import { TrickOrTreatIcon } from 'components/icons/TrickOrTreatIcon';
import { WavelengthDeviceIcon } from 'components/icons/WavelengthDeviceIcon';

type TaskIconProps = {
  task: Task;
};

export const TaskIcon = ({ task }: TaskIconProps) => {
  switch (task.game) {
    case 'arte-ruim':
      return <PictureIcon />;
    case 'caminhos-magicos':
      return <PathIcon />;
    case 'contadores-historias':
      return <FairyTaleIcon />;
    case 'crimes-hediondos':
      return <CrimeSceneIcon />;
    case 'cruza-palavras':
      return <CrossWordsIcon />;
    case 'detetives-imaginativos':
      return <DetectiveIcon />;
    case 'dilema-dos-esquiadores':
      return <SkiingIcon />;
    case 'espiao-entre-nos':
      return <PassportIcon />;
    case 'fileira-de-fatos':
      return <QueueIcon />;
    case 'galeria-de-sonhos':
      return <DreamIcon />;
    case 'mente-coletiva':
      return <SheepIcon />;
    case 'namoro-ou-amizade':
      return <LoveIcon />;
    case 'na-rua-do-medo':
      return <TrickOrTreatIcon />;
    case 'namoro-amizade':
      return <LoveIcon />;
    case 'onda-telepatica':
      return <WavelengthDeviceIcon />;
    case 'palheta-de-cores':
      return <ColorWheelIcon />;
    case 'polemica-da-vez':
      return <TrendingIcon />;
    case 'porta-dos-desesperados':
      return <MagicDoorIcon />;
    case 'quem-nao-mata':
      return <RevolverIcon />;
    case 'retrato-falado':
      return <MonsterIcon />;
    case 'super-campeonato':
      return <BoxingGlovesIcon />;
    case 'testemunha-ocular':
      return <CriminalIcon />;
    case 'ue-so-isso':
      return <GuessIcon />;
    case 'vamos-ao-cinema':
      return <MovieTheaterIcon />;
    default:
      return <TDIcon />;
  }
};
