// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
import { SuspectCard } from 'components/cards/SuspectCard';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';
// AntDesign Resources

export const TrackTaNaCara = ({ track, onSubmitAnswer }: TrackProps) => {
  const cardWidth = useCardWidth(8, { gap: 8, minWidth: 150, maxWidth: 350, margin: 8 });
  const { isLoading } = useLoading();
  const { translate } = useLanguage();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([true, false]));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Tá Na Cara', en: 'Guess Who What?' }} />
      <Instruction contained>
        <Translate
          pt="É bem óbvio só de olhar pra essa pessoa. Mas só pra confirmar, responda essa pergunta de acordo
              com o que você acha."
          en="It's pretty obvious just by looking at this person. But just to confirm, answer this question:"
        />
      </Instruction>

      <Card header={translate('Pergunta', 'Question')} color="orange">
        {track.data.question.question}
      </Card>

      <Space className="space-container" direction="vertical">
        <SuspectCard suspect={track.data.suspect} width={cardWidth} />
      </Space>

      <Space className="space-container">
        <Button
          size="large"
          icon={<IconAvatar icon={<SpeechBubbleDeclinedIcon />} />}
          onClick={() => onSelect('no')}
          disabled={isLoading}
          shape="round"
        >
          <Translate en="NO" pt="NÃO" />
        </Button>

        <Button
          size="large"
          icon={<IconAvatar icon={<SpeechBubbleAcceptedIcon />} />}
          onClick={() => onSelect('yes')}
          disabled={isLoading}
          shape="round"
        >
          <Translate en="YES" pt="SIM" />
        </Button>
      </Space>
    </>
  );
};
