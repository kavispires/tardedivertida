// Ant Design Resources
import { SkinFilled } from '@ant-design/icons';
import { Flex, Modal, Typography } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { getSuspectImageId } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
// Pages
import { Region } from 'pages/Daily/components/Region';
// Internal
import type { DailyEspionagemEntry } from '../utils/types';
import type { useEspionagemEngine } from '../utils/useEspionagemEngine';
import { FEATURE_PT_TRANSLATIONS } from '../utils/helpers';
import { Statements } from './Statements';

type ReleaseModalProps = Pick<
  ReturnType<typeof useEspionagemEngine>,
  'onRelease' | 'onDeselectSuspect' | 'activeSuspectId' | 'hearts' | 'released'
> &
  Pick<DailyEspionagemEntry, 'statements' | 'suspects' | 'additionalStatements'>;

export function ReleaseModal({
  onRelease,
  onDeselectSuspect,
  activeSuspectId,
  hearts,
  statements,
  additionalStatements,
  released,
  suspects,
}: ReleaseModalProps) {
  const width = useCardWidth(2, { margin: 32, maxWidth: 256, minWidth: 64 });

  if (!activeSuspectId) {
    return null; // If no suspect is selected, do not render the modal
  }

  const suspect = suspects.find((s) => s.id === activeSuspectId);

  if (!suspect) {
    return null; // If the suspect is not found, do not render the modal
  }

  return (
    <Modal
      title={
        <Translate
          pt={`Tem certeza que quer liberar ${suspect?.name.pt.split(' ')[0] ?? ''}?`}
          en={`Are you sure you want to release ${suspect?.name.en.split(' ')[0] ?? ''}?`}
        />
      }
      open
      onCancel={() => onDeselectSuspect()}
      cancelText={
        <Translate
          pt="Não"
          en="No"
        />
      }
      onOk={() => onRelease()}
      okText={
        <Translate
          pt="Sim"
          en="Yes"
        />
      }
    >
      <Flex
        align="center"
        gap={12}
      >
        <ImageCard
          cardId={getSuspectImageId(activeSuspectId, 'gb')}
          cardWidth={width}
          className="espionagem-suspect-card"
        />
        <Flex
          vertical
          gap={6}
        >
          <Typography.Text>
            Confira as declarações do tipo <SkinFilled />:
          </Typography.Text>

          <SuspectInfo
            name={suspect.name}
            features={suspect.features}
            gender={suspect.gender}
            variant="release"
          />
        </Flex>
      </Flex>

      <Region>
        <Typography.Text strong>
          <Translate
            pt="Declarações"
            en="Statements"
          />
        </Typography.Text>
        <Statements
          statements={statements}
          additionalStatements={additionalStatements}
          hearts={hearts}
          released={released}
        />
      </Region>
    </Modal>
  );
}

type SuspectInfoProps = {
  name: DualLanguageValue;
  features: string[];
  gender: string;
  variant: 'release' | 'result';
};

export function SuspectInfo({ name, features, gender, variant }: SuspectInfoProps) {
  const values = features.map(
    (feature) =>
      FEATURE_PT_TRANSLATIONS[`${feature}.${gender}`] || FEATURE_PT_TRANSLATIONS[feature] || feature,
  );

  return (
    <Flex
      gap={6}
      wrap
      justify={variant === 'result' ? 'center' : 'start'}
    >
      <strong>
        <DualTranslate>{name}</DualTranslate>
      </strong>
      {values.map((value, index, array) => (
        <Typography.Text
          key={value}
          code={variant === 'release'}
          italic
        >
          {value}
          {variant === 'result' && values.length > 1 && index < array.length - 1 ? ',' : ''}
        </Typography.Text>
      ))}
    </Flex>
  );
}
