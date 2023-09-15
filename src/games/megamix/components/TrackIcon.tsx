// Components
import { BoxingGlovesIcon } from 'icons/BoxingGlovesIcon';
import { ChoiceIcon } from 'icons/ChoiceIcon';
import { ColorWheelIcon } from 'icons/ColorWheelIcon';
import { CrimeSceneIcon } from 'icons/CrimeSceneIcon';
import { CriminalIcon } from 'icons/CriminalIcon';
import { CrossWordsIcon } from 'icons/CrossWordsIcon';
import { DetectiveIcon } from 'icons/DetectiveIcon';
import { DirectionsIcon } from 'icons/DirectionsIcon';
import { DreamIcon } from 'icons/DreamIcon';
import { FairyTaleIcon } from 'icons/FairyTaleIcon';
import { GuessIcon } from 'icons/GuessIcon';
import { LoveIcon } from 'icons/LoveIcon';
import { MagicDoorIcon } from 'icons/MagicDoorIcon';
import { MonsterIcon } from 'icons/MonsterIcon';
import { MovieTheaterIcon } from 'icons/MovieTheaterIcon';
import { PassportIcon } from 'icons/PassportIcon';
import { PathIcon } from 'icons/PathIcon';
import { PictureIcon } from 'icons/PictureIcon';
import { QueueIcon } from 'icons/QueueIcon';
import { RevolverIcon } from 'icons/RevolverIcon';
import { SheepIcon } from 'icons/SheepIcon';
import { SkiingIcon } from 'icons/SkiingIcon';
import { TDIcon } from 'icons/TDIcon';
import { TrendingIcon } from 'icons/TrendingIcon';
import { TrickOrTreatIcon } from 'icons/TrickOrTreatIcon';
import { WavelengthDeviceIcon } from 'icons/WavelengthDeviceIcon';

type TrackIconProps = {
  track: Track;
};

export const TrackIcon = ({ track }: TrackIconProps) => {
  switch (track.game) {
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
    case 'megamix-best-of-three':
      return <ChoiceIcon />;
    case 'megamix-this-that':
      return <DirectionsIcon />;
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
