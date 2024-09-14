// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import { achievementsReference } from './utils/achievements';
import { MonsterSketches } from './components/MonsterSketches';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const canvasWidth = useCardWidth(6, {
    gap: 16,
    minWidth: 150,
    maxWidth: 500,
  });

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements achievements={state.achievements} players={players} reference={achievementsReference} />
      <div>
        <Title level={2}>
          <Translate pt="Desenhos" en="Sketches" />
        </Title>
        <div className="r-gallery">
          <MonsterSketches
            sketches={state.gallery}
            players={players}
            canvasSize={canvasWidth}
            canvasWidth={canvasWidth}
          />
        </div>
      </div>
    </GameOverWrapper>
  );
}
