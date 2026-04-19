import { orderBy } from 'lodash';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over/GameOverWrapper';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language/Translate';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import achievementsReference from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { ORDER } from './utils/constants';
import { BankClient } from './components/BankClient';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const gallery: UID[] = orderBy(
    state.gallery ?? [],
    [
      (id) => id.includes('neutral'),
      (id) => players[state.deckDict?.[id]?.playerId]?.name,
      (id) => ORDER.findIndex((entry) => entry.id === state.deckDict?.[id]?.type),
    ],
    ['asc', 'asc', 'asc'],
  );

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
      <TitledContainer
        title={
          <Translate
            pt="Clientes Atendidos"
            en="Best Pairs"
          />
        }
        className="mt-4"
      >
        {gallery.map((cardId: UID, index) => (
          <BankClient
            key={`bank-client-${cardId}-${index}`}
            cardId={cardId}
            deckDict={state.deckDict}
            cardWidth={64}
          />
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
