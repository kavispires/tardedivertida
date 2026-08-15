import { groupBy, orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { NPCPlayerAvatarName, PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import achievementsReference from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { ORDER } from './utils/constants';
import { BankClient } from './components/BankClient';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const galleryByColor = useMemo(() => {
    const cards = state.gallery ?? [];

    // Group cards by playerId (color)
    const grouped = groupBy(cards, (id) => state.deckDict?.[id]?.playerId ?? 'neutral');

    // Sort each group by card type
    const sortedGroups = Object.entries(grouped).map(([playerId, cardIds]) => ({
      playerId,
      isNeutral: playerId === 'neutral',
      playerName: players[playerId]?.name ?? 'Neutral',
      cards: orderBy(
        cardIds,
        [(id) => ORDER.findIndex((entry) => entry.id === state.deckDict?.[id]?.type)],
        ['asc'],
      ),
    }));

    // Sort groups: non-neutral first (by player name), then neutral last
    return orderBy(sortedGroups, ['isNeutral', (o) => o.cards.length, 'playerName'], ['asc', 'desc', 'asc']);
  }, [state.gallery, state.deckDict, players]);

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
            en="Served Customers"
          />
        }
        className="mt-4"
      >
        <Flex>
          {galleryByColor.map(({ playerId, cards }) => (
            <div
              key={`color-group-${playerId}`}
              className="mb-4"
            >
              {playerId !== 'neutral' ? (
                <PlayerAvatarName player={players[playerId]} />
              ) : (
                <NPCPlayerAvatarName botId={'A'} />
              )}
              <div className="flex flex-wrap gap-2">
                {cards.map((cardId: UID, index) => (
                  <BankClient
                    key={`bank-client-${cardId}-${index}`}
                    cardId={cardId}
                    deckDict={state.deckDict}
                    cardWidth={96}
                  />
                ))}
              </div>
            </div>
          ))}
        </Flex>
      </TitledContainer>
    </GameOverWrapper>
  );
}
