// Types
import type { GamePlayers } from 'types/game';
// Hooks
import type { SlideShowConfig } from '@hooks/useSlideShow';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
import { PopoverRule } from '@components/rules/PopoverRule';
import { SlideShow } from '@components/slide-show/SlideShow';
import { Step } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Concept, GalleryEntry } from './utils/types';
import { ScoringRules } from './components/RulesBlobs';
import { DefinitionPage } from './components/DefinitionPage';
import { CreditsPage } from './components/CreditsPage';

type StepGalleryProps = {
  gallery: GalleryEntry[];
  players: GamePlayers;
  slideShowConfig: SlideShowConfig;
  basicConcepts: Concept[];
  concepts: Concept[];
};

export function StepGallery({
  gallery,
  players,
  slideShowConfig,

  basicConcepts,
  concepts,
}: StepGalleryProps) {
  const galleryEntry = gallery[slideShowConfig.slideIndex];

  const creator = players[galleryEntry.playerId];
  const currentColor = getAvatarColorById(creator.avatarId);

  return (
    <Step
      fullWidth
      hidePlayersBar
    >
      <StepTitle size="small">
        <Translate
          pt="Novos termos no dicionário"
          en="New Terms in the Dictionary"
        />
      </StepTitle>

      <PopoverRule content={<ScoringRules />} />

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        leftClassName="idp-gallery__left-page"
        rightClassName="idp-gallery__right-page"
      >
        <DefinitionPage
          entry={galleryEntry}
          basicConcepts={basicConcepts}
          concepts={concepts}
        />

        <CreditsPage
          creator={creator}
          creatorColor={currentColor}
          entry={galleryEntry}
          players={players}
        />
      </SlideShow>
    </Step>
  );
}
