// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { Card } from 'components/cards/Card';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

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
        <Translate
          pt="Selecione qual você prefere:"
          en="Select which one you prefer:"
        />
      </RuleInstruction>
      <Space
        orientation="vertical"
        align="center"
        className="contained margin"
      >
        <SpaceContainer>
          <TransparentButton
            onClick={() => onSelect(0)}
            disabled={isLoading || user.ready}
          >
            <Card
              header={translate({ pt: 'Isso', en: 'This' })}
              color="red"
            >
              {track.data.card.options[0]}
            </Card>
          </TransparentButton>

          <TransparentButton
            onClick={() => onSelect(1)}
            disabled={isLoading || user.ready}
          >
            <Card
              header={translate({ pt: 'Aquilo', en: 'That' })}
              color="blue"
            >
              {track.data.card.options[1]}
            </Card>
          </TransparentButton>
        </SpaceContainer>
      </Space>
    </>
  );
};
