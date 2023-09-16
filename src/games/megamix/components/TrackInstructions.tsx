// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { INSTRUCTIONS } from '../utils/constants';

type TrackInstructionsProps = {
  track: Track;
};

export const TrackInstructions = ({ track }: TrackInstructionsProps) => {
  const { dualTranslate } = useLanguage();

  const instruction: DualLanguageValue = INSTRUCTIONS?.[track.game] ?? {
    pt: 'Se vire nos 30!',
    en: 'Do something!',
  };

  return <>{dualTranslate(instruction)}</>;
};
