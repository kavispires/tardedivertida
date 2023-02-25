import { orderBy } from 'lodash';
// Ant Design Resources
import { Space } from 'antd';
// Utils
import { achievementsReference } from './utils/helpers';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { FinalCharacter } from './components/FinalCharacter';

function PhaseGameOver({ state, players, info, meta }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Space className="space-container" wrap>
        {orderBy(state.gallery, `name.${meta.language}`).map((entry: FinalCharacter) => (
          <FinalCharacter players={players} character={entry} glyphWidth={30} key={entry.id} />
        ))}
      </Space>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
