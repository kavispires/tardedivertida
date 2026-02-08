// Internal
import type { FofocaQuenteDefaultState } from '../utils/types';
import { StudentCard } from './StudentCard';

type RumorTrackProps = {
  students: FofocaQuenteDefaultState['students'];
  socialGroups: FofocaQuenteDefaultState['socialGroups'];
  rumorTracker: FofocaQuenteDefaultState['rumorTracker'];
};

export function RumorTrack({ students, socialGroups, rumorTracker }: RumorTrackProps) {
  return (
    <div className="f-rumor-track">
      <div className="f-rumor-track__slot">{/* <StudentCard /> */}</div>

      <div className="f-rumor-track__slot"></div>

      <div className="f-rumor-track__slot"></div>

      <div className="f-rumor-track__slot"></div>

      <div className="f-rumor-track__slot"></div>
    </div>
  );
}
