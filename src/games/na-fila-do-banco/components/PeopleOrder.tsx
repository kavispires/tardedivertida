// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Components
import { ImageCard } from '@components/image-cards/ImageCard';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
// Internal
import { ORDER } from '../utils/constants';

export function PeopleOrder() {
  return (
    <TitledContainer
      title={
        <Translate
          pt="Regras de Prioridade"
          en="Priority Rules"
        />
      }
    >
      <Flex
        gap={3}
        className="contained"
        align="center"
      >
        {ORDER.map((entry) => (
          <Tooltip
            key={entry.id}
            title={<DualTranslate>{entry.description}</DualTranslate>}
          >
            <ImageCard
              cardId={entry.imageId}
              cardWidth={64}
            />
          </Tooltip>
        ))}
      </Flex>
    </TitledContainer>
  );
}
