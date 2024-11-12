// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
// Internal
import { getReference } from './utils/helpers';
import achievementsReference from './utils/achievements';
import { FinalScenarios } from './components/FinalScenarios';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<FlagIcon />}>
      <Achievements
        achievements={state.achievements}
        players={players}
        reference={achievementsReference}
        white
      />

      <Container title={<Translate pt="Cenários" en="Scenarios" />} titleProps={{ white: true }}>
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
