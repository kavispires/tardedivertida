import clsx from 'clsx';
// Ant Design Resources
import { Card, Flex, Input } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SpeakButton } from 'components/audio/SpeakButton';
import { DualTranslate } from 'components/language';
// Internal
import type { Concept } from '../utils/types';
import { useSpriteWidth } from '../utils/useSpriteWidth';
import { BASIC_CONCEPTS_TRANSLATIONS } from '../utils/constants';

type BasicConceptBlockProps = {
  concept: Concept;
  onSelect?: (conceptId: string) => void;
};

export function BasicConceptBlock({
  concept,

  onSelect,
}: BasicConceptBlockProps) {
  const itemWidth = useSpriteWidth();
  const { dualTranslate } = useLanguage();

  return (
    <Card size="small" className="concept-block" style={{ width: itemWidth * 3 }}>
      <Flex className="concept-block__header" justify="space-between" align="center">
        <div className="concept-block__sound">
          <SpeakButton text={concept.syllable} />
          <div
            className={clsx('concept-block__syllable', {
              'concept-block__syllable--button': !!onSelect,
            })}
            onClick={() => onSelect?.(concept.id)}
          >
            <DualTranslate>{concept.syllable}</DualTranslate>
          </div>
        </div>
      </Flex>

      <Input
        defaultValue={dualTranslate(BASIC_CONCEPTS_TRANSLATIONS[concept.meaning])}
        readOnly
        variant="filled"
        className="mt-2"
      />
    </Card>
  );
}
