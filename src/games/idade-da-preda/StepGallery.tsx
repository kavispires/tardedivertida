// Types
import type { GamePlayers } from 'types/player';
// Hooks
import type { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
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
  useTemporarilyHidePlayersBar();

  const galleryEntry = gallery[slideShowConfig.slideIndex];

  const creator = players[galleryEntry.playerId];
  const currentColor = getAvatarColorById(creator.avatarId);

  return (
    <Step fullWidth>
      <StepTitle size="small">
        <Translate pt="Novos termos no dicionário" en="New Terms in the Dictionary" />
      </StepTitle>

      <PopoverRule content={<ScoringRules />} />

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        leftClassName="idp-gallery__left-page"
        rightClassName="idp-gallery__right-page"
      >
        <DefinitionPage entry={galleryEntry} basicConcepts={basicConcepts} concepts={concepts} />

        <CreditsPage creator={creator} creatorColor={currentColor} entry={galleryEntry} players={players} />
      </SlideShow>
    </Step>
  );
}
