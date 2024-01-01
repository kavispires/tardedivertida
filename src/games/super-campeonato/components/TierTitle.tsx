// Types
import type { BracketTier } from '../utils/type';
// Components
import { Translate } from 'components/language';

type TierTitleProps = {
  tier: BracketTier;
};

export function TierTitle({ tier }: TierTitleProps) {
  if (tier === 'quarter') return <Translate pt="Quartas de finais" en="Quarterfinals" />;
  if (tier === 'semi') return <Translate pt="Semifinais" en="Semifinals" />;
  return <Translate pt="Final" en="Final" />;
}
