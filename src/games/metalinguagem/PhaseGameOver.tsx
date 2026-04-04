// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over/GameOverWrapper';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language/Translate';
import { TitledContainer } from 'components/layout/TitledContainer';
import { Instruction } from 'components/text/Instruction';
// Internal
import achievementsReference from './utils/achievements';
import type { MetalinguagemGalleryEntry, PhaseGameOverState } from './utils/types';
import { Portmanteau } from './components/Portmanteau';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const gallery: MetalinguagemGalleryEntry[] = state.gallery ?? [];

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      {state.winners?.length === 0 && (
        <Instruction contained>
          <Translate
            pt="Vocês perderam!"
            en="Y'all lost!"
          />
        </Instruction>
      )}
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
      <TitledContainer
        title={
          <Translate
            pt="Dicionário"
            en="Dictionary"
          />
        }
        className="mt-4"
      >
        {gallery.map((word: MetalinguagemGalleryEntry) => (
          <Portmanteau
            key={`${word.itemsIds[0]}-${word.itemsIds[1]}`}
            itemsIds={word.itemsIds}
            word={word.name}
            names={word.names}
            correct={word.correct}
          />
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
