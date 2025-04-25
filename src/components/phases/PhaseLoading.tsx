// Types
import type { PhaseProps } from 'types/game';
// Components
import { LoadingPage } from 'components/loaders';

export function PhaseLoading(_props: PhaseProps) {
  return (
    <LoadingPage
      message={{
        en: 'Fetching game phase...',
        pt: 'Buscando fase do jogo...',
      }}
    />
  );
}
