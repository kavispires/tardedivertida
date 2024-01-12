// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Utils
import { getReference } from './utils/helpers';
import achievementsReference from './utils/achievements';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { Container } from 'components/general/Container';
import { FinalScenarios } from './components/FinalScenarios';
import { Achievements } from 'components/general/Achievements';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<FlagIcon />}>
      <Achievements achievements={state.achievements} players={players} reference={achievementsReference} />

      <Container title={<Translate pt="Cenários" en="Scenarios" />}>
        {state.gallery &&
          state.gallery.map((entry: PlainObject, index: number) => (
            <Space className="space-contained" key={`gallery-entry-${entry.playerId}-${index}`}>
              <FinalScenarios
                scenarios={entry.scenarios}
                reference={getReference('negative')}
                player={players[entry.playerId]}
              />
            </Space>
          ))}
      </Container>
    </GameOverWrapper>
  );
}
