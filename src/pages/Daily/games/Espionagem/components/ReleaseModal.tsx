import { Region } from 'pages/Daily/components/Region';
// Ant Design Resources
import { Modal, Typography } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
// Internal
import type { DailyEspionagemEntry } from '../utils/types';
import type { useEspionagemEngine } from '../utils/useEspionagemEngine';
import { Statements } from './Statements';

type ReleaseModalProps = Pick<
  ReturnType<typeof useEspionagemEngine>,
  'onRelease' | 'onDeselectSuspect' | 'activeSuspectId' | 'statementsCutoffLength' | 'released'
> &
  Pick<DailyEspionagemEntry, 'statements' | 'suspects'>;

export function ReleaseModal({
  onRelease,
  onDeselectSuspect,
  activeSuspectId,
  statementsCutoffLength,
  statements,
  released,
  suspects,
}: ReleaseModalProps) {
  const width = useCardWidth(3, { margin: 32, maxWidth: 256, minWidth: 64 });

  if (!activeSuspectId) {
    return null; // If no suspect is selected, do not render the modal
  }

  const suspect = suspects.find((s) => s.id === activeSuspectId);

  return (
    <Modal
      title={
        <Translate
          pt={`Tem certeza que quer liberar ${suspect?.name.pt ?? ''} ?`}
          en={`Are you sure you want to release ${suspect?.name.en ?? ''} ?`}
        />
      }
      open
      onCancel={() => onDeselectSuspect()}
      cancelText={<Translate pt="Não" en="No" />}
      onOk={() => onRelease()}
      okText={<Translate pt="Sim" en="Yes" />}
    >
      <Region>
        <ImageCard id={activeSuspectId} cardWidth={width} className="espionagem-suspect-card" />
      </Region>

      <Region>
        <Typography.Text strong>
          <Translate pt="Declarações" en="Statements" />
        </Typography.Text>
        <Statements
          statements={statements}
          statementsCutoffLength={statementsCutoffLength}
          released={released}
        />
      </Region>
    </Modal>
  );
}
