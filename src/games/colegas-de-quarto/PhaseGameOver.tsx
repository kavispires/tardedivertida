import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { CrownIcon } from '@icons/CrownIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import { achievementsReference } from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { HouseItem } from './components/HouseItem';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const purchases = useMemo(() => {
    return Object.keys(state.purchases)
      .sort()
      .map((key) => state.purchases[key]);
  }, [state.purchases]);
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
            pt="Coisas que adicionamos à nossa casa"
            en="Things we added to our house"
          />
        }
        contentProps={{ className: 'final-gallery' }}
      >
        {purchases.map((item, index) => (
          <HouseItem
            key={item.id}
            text={item.text}
            index={Number(item.id)}
            setId={index + 1}
          />
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
