import { clsx } from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { SuspectCardData, SuspectStyleVariant } from 'types/tdr';
// Components
import { ComponentPreview } from '@components/general/ComponentPreview';
import { DualTranslate } from '@components/language/DualTranslate';
import { Sprite } from '@components/sprites/Sprite';
// Internal
import { DynamicCard } from './DynamicCard';
// Sass
import styles from './SuspectCard.module.scss';

/**
 * Controls which optional parts of the suspect card should be visible.
 */
type SuspectCardVisibleContentConfig = {
  /**
   * Whether the gender icon should be displayed
   */
  genderIcon: boolean;
  /**
   * Whether the suspect name should be displayed
   */
  name: boolean;
  /**
   * Whether the suspect deck icon should be displayed
   */
  deckIcon: boolean;
};

/**
 * Visibility configuration for optional suspect card content.
 */
type SuspectCardVisibleContent = Partial<SuspectCardVisibleContentConfig> | boolean;

/**
 * Props for the suspect card component.
 */
type SuspectCardProps = {
  /**
   * The suspect data rendered by the card
   */
  suspect: SuspectCardData;
  /**
   * The card width in pixels
   */
  width: number;
  /**
   * Optional style variant used to derive the image id
   */
  variant?: SuspectStyleVariant;
  /**
   * Whether the card should be rendered inside preview chrome
   */
  preview?: boolean;
  /**
   * Optional additional class names for the card container
   */
  className?: string;
  /**
   * Optional inline styles applied to the card container
   */
  style?: Omit<React.CSSProperties, 'width'>;
  /**
   * Optional visible content settings for the card
   * Pass `true` to show everything, `false` to hide everything,
   * or an object to configure individual parts.
   * @default true
   */
  visibleContent?: SuspectCardVisibleContent;
};

/**
 * Position and transform values applied to the suspect name label.
 */
type LabelTransform = {
  /**
   * The label rotation angle in degrees
   */
  angle: number;
  /**
   * The label scale multiplier
   */
  scale: number;
  /**
   * The vertical position percentage for the label
   */
  y: number;
};

/**
 * Renders the base suspect card content without preview framing.
 */
function SuspectCardBase({
  suspect,
  width,
  variant,
  className,
  style,
  visibleContent = true,
}: SuspectCardProps) {
  const imageId = getSuspectImageId(suspect.id, variant);
  const { angle, scale, y } = getLabelTransform(suspect.labelTransform || '0|0');
  const visible = getVisibleContentConfig(visibleContent);
  const shouldDisplayLabel = visible.genderIcon || visible.name;

  return (
    <DynamicCard
      aspectRatio={1.5}
      backgroundImageId={imageId}
      width={width}
      style={style}
      className={clsx(styles.suspectCard, className)}
    >
      {visible.deckIcon && (
        <DynamicCard.Span
          fontSize="12cqw"
          right="2%"
          top="0%"
        >
          <span className={styles.suspectDeck}>
            <DeckIcon deck={suspect.deck} />
          </span>
        </DynamicCard.Span>
      )}

      {shouldDisplayLabel && (
        <DynamicCard.Span
          centerHorizontal
          fontSize="12cqw"
          style={{
            rotate: `${angle}deg`,
            scale: `${scale}`,
          }}
          top={`${y}%`}
        >
          <span className={styles.suspectCardName}>
            {visible.genderIcon && <GenderIcon gender={suspect.gender} />}
            {visible.name && (
              <Tooltip title={<DualTranslate>{suspect.name}</DualTranslate>}>
                <span>
                  <DualTranslate>{suspect.name}</DualTranslate>
                </span>
              </Tooltip>
            )}
          </span>
        </DynamicCard.Span>
      )}
    </DynamicCard>
  );
}

/**
 * Displays a suspect card with optional preview framing and configurable visible content.
 */
export function SuspectCard(props: SuspectCardProps) {
  if (!props.preview) {
    return <SuspectCardBase {...props} />;
  }

  return (
    <ComponentPreview aspectRatio={2 / 3}>
      <SuspectCardBase {...props} />
    </ComponentPreview>
  );
}

const DEFAULT_VISIBLE_CONTENT: SuspectCardVisibleContentConfig = {
  genderIcon: true,
  name: true,
  deckIcon: false,
};

/**
 * Normalizes the visible content prop into a full configuration object.
 * @param visibleContent - The optional visible content override
 * @returns A complete visibility configuration for the suspect card
 */
function getVisibleContentConfig(
  visibleContent: SuspectCardVisibleContent = true,
): SuspectCardVisibleContentConfig {
  if (visibleContent === false) {
    return {
      genderIcon: false,
      name: false,
      deckIcon: false,
    };
  }

  if (visibleContent === true) {
    return DEFAULT_VISIBLE_CONTENT;
  }

  return {
    ...DEFAULT_VISIBLE_CONTENT,
    ...visibleContent,
  };
}

/**
 * Generates the image id used to render a suspect card.
 * @param id - The original suspect id
 * @param variant - The optional suspect style variant
 * @returns The base id or the variant-adjusted id
 */
export const getSuspectImageId = (() => {
  const cache = new Map<string, string>();

  return (id: string, variant?: SuspectStyleVariant): string => {
    if (!variant) {
      return id;
    }

    const key = `${id}|${variant ?? ''}`;

    if (cache.has(key)) return cache.get(key) as string;

    const splitId = id.split('-');
    const result = `${splitId[0]}-${variant}-${splitId[splitId.length - 1]}`;
    cache.set(key, result);
    return result;
  };
})();

/**
 * Parses and caches the transform data for a suspect name label.
 */
const getLabelTransform = (() => {
  const cache = new Map<string, LabelTransform>();

  return (id: string): LabelTransform => {
    if (cache.has(id)) return cache.get(id) as LabelTransform;

    const splitId = id.split('-');
    const y = Number.parseFloat(splitId[0]) || 83;
    const angle = Number.parseFloat(splitId[1]) || 0;
    const scale = Number.parseFloat(splitId[2]) || 1;

    const result = { angle, scale, y };
    cache.set(id, result);
    return result;
  };
})();

const GENDER_TITLES = {
  male: { en: 'Male', pt: 'Masculino' },
  female: { en: 'Female', pt: 'Feminino' },
  'non-binary': { en: 'Non-binary', pt: 'Não-binárie' },
  fluid: { en: 'Fluid', pt: 'Fluido' },
  transgender: { en: 'Transgender', pt: 'Transgênero' },
  none: { en: 'No gender/Unknown', pt: 'Sem gênero/Desconhecido' },
} as const;

/**
 * Displays the translated gender icon tooltip for a suspect.
 */
function GenderIcon({ gender }: Pick<Required<SuspectCardData>, 'gender'>) {
  const title =
    gender in GENDER_TITLES ? GENDER_TITLES[gender as keyof typeof GENDER_TITLES] : GENDER_TITLES.none;

  return (
    <Tooltip title={<DualTranslate>{title}</DualTranslate>}>
      <Sprite
        source="demographics"
        spriteId={`gender-${gender || 'gender-other'}`}
        width="1em"
      />
    </Tooltip>
  );
}

const DECK_TITLES = {
  kid: { en: 'Kid', pt: 'Criança' },
  teen: { en: 'Teen', pt: 'Adolescente' },
  adult: { en: 'Adult', pt: 'Adulto' },
  pet: { en: 'Pet', pt: 'Animal de estimação' },
  other: { en: 'Other', pt: 'Outro' },
} as const;

/**
 * Displays the translated deck icon tooltip for a suspect.
 */
function DeckIcon({ deck }: { deck: SuspectCardData['deck'] }) {
  const title = deck in DECK_TITLES ? DECK_TITLES[deck as keyof typeof DECK_TITLES] : DECK_TITLES.other;

  return (
    <Tooltip title={<DualTranslate>{title}</DualTranslate>}>
      <span className={styles.suspectDeckIcon}>
        <Sprite
          source="demographics"
          spriteId={`deck-${deck || 'deck-other'}`}
          width="1.5em"
        />
      </span>
    </Tooltip>
  );
}
