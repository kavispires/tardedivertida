import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Spin, Tooltip } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SignCard } from 'components/cards/SignCard';
// Internal
import { useAlienAttributes } from './useAlienAttributes';
// Sass
import styles from './AlienText.module.scss';

type AlienTextProps = {
  /**
   * The text value to be displayed (in alien language)
   */
  value: string;
  /**
   * If true, it will display the translation of the text
   */
  withTranslation?: boolean;
} & ElementProps;

export function AlienText({ value, withTranslation = false, className, ...divProps }: AlienTextProps) {
  const { isLoading, data: attributes = {} } = useAlienAttributes(true);
  const { dualTranslate } = useLanguage();

  const characters = useMemo(() => {
    const splitLetters = splitStringEvery4(value);

    return splitLetters.map((character) => {
      const variantKey = character[0];
      const attributeId = character.substring(1);
      if (attributeId && attributes?.[attributeId]) {
        const attribute = attributes[attributeId];
        return {
          spriteId: attribute?.spriteId,
          variant: variantsName[variantKey],
          name: {
            pt: `${variants[variantKey].pt}${attribute?.name.pt}`.trim().toLowerCase(),
            en: `${variants[variantKey].en}${attribute?.name.en}`.trim().toLowerCase(),
          },
          description: {
            en: attribute?.description.en ?? '',
            pt: attribute?.description.pt ?? '',
          },
        };
      }

      return {
        spriteId: '',
        variant: variantsName[variantKey],
        name: { pt: `${variants[variantKey].pt} `, en: `${variants[variantKey].en} ` },
        description: { pt: '', en: '' },
      };
    });
  }, [value, attributes]);

  return (
    <Spin spinning={isLoading}>
      <div
        className={clsx(styles.alienText, className)}
        {...divProps}
      >
        {characters.map((character) => {
          return (
            <Tooltip
              title={dualTranslate(character.name)}
              key={`${character.spriteId}-${character.variant}`}
            >
              <div
                className={clsx(
                  styles.character,
                  styles[
                    `character${character.variant.charAt(0).toUpperCase() + character.variant.slice(1)}`
                  ],
                )}
              >
                <SignCard
                  width={48}
                  signId={`${character.spriteId.split('-')[1]}`}
                  className="transparent"
                />
              </div>
            </Tooltip>
          );
        })}
      </div>
      {withTranslation && (
        <div className={styles.alienTextTranslation}>
          {characters.map((character) => {
            return (
              <Tooltip
                title={dualTranslate(character.description)}
                key={`${character.spriteId}-${character.variant}`}
              >
                <span className={styles.text}>{dualTranslate(character.name)}</span>
              </Tooltip>
            );
          })}
        </div>
      )}
    </Spin>
  );
}

function splitStringEvery4(str: string): string[] {
  const result: string[] = [];
  for (let i = 0; i < str.length; i += 4) {
    result.push(str.substring(i, i + 4));
  }
  return result;
}

const variants: Record<string, DualLanguageValue> = {
  '+': {
    en: '',
    pt: '',
  },
  '^': {
    en: 'not ',
    pt: 'não ',
  },
  '~': {
    en: 'sorta ',
    pt: 'meio ',
  },
  '*': {
    en: 'very ',
    pt: 'muito ',
  },
};

const variantsName: Record<string, string> = {
  '+': 'normal',
  '^': 'not',
  '~': 'sorta',
  '*': 'very',
};
