// Icons
import { AlienCommunicationIcon } from 'icons/AlienCommunicationIcon';
import { AnonymousIcon } from 'icons/AnonymousIcon';
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
import { MirrorIcon } from 'icons/MirrorIcon';
import { MonsterIcon } from 'icons/MonsterIcon';
import { MovieTheaterIcon } from 'icons/MovieTheaterIcon';
import { PassportIcon } from 'icons/PassportIcon';
import { PathIcon } from 'icons/PathIcon';
import { PictureIcon } from 'icons/PictureIcon';
import { QueueIcon } from 'icons/QueueIcon';
import { ReviewIcon } from 'icons/ReviewIcon';
import { RevolverIcon } from 'icons/RevolverIcon';
import { SheepIcon } from 'icons/SheepIcon';
import { SkiingIcon } from 'icons/SkiingIcon';
import { TDIcon } from 'icons/TDIcon';
import { TrendingIcon } from 'icons/TrendingIcon';
import { TrickOrTreatIcon } from 'icons/TrickOrTreatIcon';
import { WavelengthDeviceIcon } from 'icons/WavelengthDeviceIcon';
// Internal
import type { Track } from '../utils/types';
// Type

type TrackIconProps = {
  track: Track;
};

export const TrackIcon = ({ track }: TrackIconProps) => {
  const IconComponent =
    {
      'arte-ruim': PictureIcon,
      'comunicacao-alienigena': AlienCommunicationIcon,
      'contadores-historias': FairyTaleIcon,
      'crimes-hediondos': CrimeSceneIcon,
      'cruza-palavras': CrossWordsIcon,
      'detetives-imaginativos': DetectiveIcon,
      'dilema-dos-esquiadores': SkiingIcon,
      'espiao-entre-nos': PassportIcon,
      'fileira-de-fatos': QueueIcon,
      'galeria-de-sonhos': DreamIcon,
      'labirinto-secreto': PathIcon,
      'megamix-best-of-three': ChoiceIcon,
      'megamix-this-that': DirectionsIcon,
      'megamix-who-said-this': AnonymousIcon,
      'mente-coletiva': SheepIcon,
      'namoro-ou-amizade': LoveIcon,
      'na-rua-do-medo': TrickOrTreatIcon,
      'onda-telepatica': WavelengthDeviceIcon,
      'palheta-de-cores': ColorWheelIcon,
      'polemica-da-vez': TrendingIcon,
      'porta-dos-desesperados': MagicDoorIcon,
      'quem-nao-mata': RevolverIcon,
      'quem-sou-eu': MirrorIcon,
      'retrato-falado': MonsterIcon,
      'super-campeonato': BoxingGlovesIcon,
      'testemunha-ocular': CriminalIcon,
      'ta-na-cara': ReviewIcon,
      'ue-so-isso': GuessIcon,
      'vamos-ao-cinema': MovieTheaterIcon,
    }?.[track.game] ?? TDIcon;

  return <IconComponent />;
};
