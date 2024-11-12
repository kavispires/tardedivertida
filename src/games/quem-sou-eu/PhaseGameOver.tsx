import { orderBy } from 'lodash';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
// Internal
import type { FinalCharacterEntry } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { FinalCharacter } from './components/FinalCharacter';

export function PhaseGameOver({ state, players, meta }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Space className="space-container" wrap>
        {orderBy(state.gallery, `name.${meta.language}`).map((entry: FinalCharacterEntry) => (
          <FinalCharacter
            players={players}
            character={entry}
            glyphWidth={30}
            key={entry.id}
            imageCardsMode={!!meta.options?.imageCardsMode}
          />
        ))}
      </Space>
    </GameOverWrapper>
  );
}
