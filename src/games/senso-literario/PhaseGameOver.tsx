// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { BookPatternCard } from 'components/cards/BookPatternCard';
import { GameOverWrapper } from 'components/game-over/GameOverWrapper';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TitledContainer } from 'components/layout/TitledContainer';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
// Internal
import { achievementsReference } from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const cardWidth = useCardWidth(8, { maxWidth: 128 });
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<CrownIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <TitledContainer
        title={
          <Translate
            pt="Prateleiras"
            en="Shelves"
          />
        }
        contentProps={{ className: 'final-gallery', orientation: 'vertical' }}
      >
        {state.gallery.map((entry) => (
          <Flex
            vertical
            key={entry.sequence.join('')}
            className="contained"
          >
            <SpaceContainer>
              {entry.sequence.map((patternId, index) => (
                <BookPatternCard
                  patternId={patternId}
                  key={index}
                  cardWidth={cardWidth}
                />
              ))}
            </SpaceContainer>
            <SpaceContainer>
              {entry.cards.map((card, index) => (
                <Flex
                  vertical
                  align="center"
                  key={index}
                  gap={8}
                  wrap
                >
                  <BookPatternCard
                    patternId={card.patternId}
                    key={index}
                    cardWidth={cardWidth * 0.75}
                  />
                  <ListOfPlayers
                    players={players}
                    list={card.playersIds}
                    prefix={card.patternId}
                    style={{ maxWidth: cardWidth }}
                  />
                </Flex>
              ))}
            </SpaceContainer>
          </Flex>
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
