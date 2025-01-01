// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';

type WinningCountProps = {
  winners: number;
  total: number;
};

export function WinningCount({ winners, total }: WinningCountProps) {
  return (
    <SpaceContainer>
      <PlayersHighlight>{winners}</PlayersHighlight> <span>vs</span>{' '}
      <PlayersHighlight className="grayscale">{total - winners}</PlayersHighlight>
    </SpaceContainer>
  );
}
