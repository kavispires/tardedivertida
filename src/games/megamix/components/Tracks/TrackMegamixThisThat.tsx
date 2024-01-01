// AntDesign Resources
import { Space } from 'antd';
// Types
import type { TrackProps } from '../../utils/types';
// Hooks
import { useMock } from 'hooks/useMock';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';

import { TransparentButton } from 'components/buttons';

export const TrackMegamixThisThat = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  const onSelect = (index: number) => {
    onSubmitAnswer({
      data: { value: String(index) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([0, 1]));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Isso ou Aquilo?', en: 'This or That?' }} />
      <RuleInstruction type="action">
        <Translate pt="Selecione qual você prefere:" en="Select which one you prefer:" />
      </RuleInstruction>
      <Space direction="vertical" align="center" className="contained margin">
        <Space className="space-container">
          <TransparentButton onClick={() => onSelect(0)} disabled={isLoading || user.ready}>
            <Card header={translate('Isso', 'This')} color="red">
              {track.data.card.options[0]}
            </Card>
          </TransparentButton>

          <TransparentButton onClick={() => onSelect(1)} disabled={isLoading || user.ready}>
            <Card header={translate('Aquilo', 'That')} color="blue">
              {track.data.card.options[1]}
            </Card>
          </TransparentButton>
        </Space>
      </Space>
    </>
  );
};
