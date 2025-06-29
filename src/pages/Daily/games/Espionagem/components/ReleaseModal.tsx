import { Region } from 'pages/Daily/components/Region';
// Ant Design Resources
import { Flex, Modal, Typography } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { getSuspectImageId } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
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
      cancelText={<Translate pt="Não" en="No" />}
      onOk={() => onRelease()}
      okText={<Translate pt="Sim" en="Yes" />}
    >
      <Flex align="center" gap={12}>
        <ImageCard
          id={getSuspectImageId(activeSuspectId, 'gb')}
          cardWidth={width}
          className="espionagem-suspect-card"
        />
        <Typography.Paragraph italic>
          {gatherSuspectInfo(suspect.features, suspect.gender)}
        </Typography.Paragraph>
      </Flex>

      <Region>
        <Typography.Text strong>
          <Translate pt="Declarações" en="Statements" />
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

const gatherSuspectInfo = (features: string[], gender: string) => {
  return features
    .map(
      (feature) =>
        FEATURE_PT_TRANSLATIONS[`${feature}.${gender}`] || FEATURE_PT_TRANSLATIONS[feature] || feature,
    )
    .join(', ');
};
