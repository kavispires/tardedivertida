// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Types
import type { SuspectCard as SuspectCardType } from 'types/tdi';
import type { TrackProps } from '../../utils/types';
// Hooks
import { useMock } from 'hooks/useMock';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { Card } from 'components/cards';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
import { Avatar } from 'components/avatars';
import { SpeechBubble } from 'components/text/SpeechBubble';
import { SuspectCard } from 'components/cards/SuspectCard';

export const TrackTestemunhaOcular = ({ track, onSubmitAnswer, user }: TrackProps) => {
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
    onSelect(mockSelection(track.data.suspects, 'id'));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Testemunha Ocular', en: 'Eye Witness' }} />
      <Space direction="vertical" align="center" className="contained margin">
        <Instruction contained>
          <Translate
            pt="Uma testemunha deu essa resposta ao tentar falar quem era o criminoso à polícia."
            en="A witness gave this answer when trying to explain who the perpetrator was to the police."
          />
        </Instruction>

        <Card header={translate('Pergunta', 'Question')} color="orange">
          {track.data.question.question}
        </Card>

        <Space className="space-container">
          <Avatar id="A" size="large" />{' '}
          <SpeechBubble shadow size="small">
            {track.data.answer ? (
              <Translate en="YES" pt="SIM" />
            ) : (
              <>
                <Translate en="NO" pt="NÃO" />
              </>
            )}{' '}
            <IconAvatar
              size="large"
              icon={track.data.answer ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
            />
          </SpeechBubble>
        </Space>

        <Instruction contained>
          <Translate
            pt="Qual dos suspeito você acha que é o criminoso?"
            en="Which one of them is the perpetrator?"
          />
        </Instruction>

        <Image.PreviewGroup>
          <Space className="space-container">
            {track.data.suspects.map((suspect: SuspectCardType) => {
              return (
                <Space className="space-container" direction="vertical" key={suspect.id}>
                  <SuspectCard suspect={suspect} width={cardWidth} />

                  <Button
                    shape="round"
                    type="primary"
                    disabled={user.ready}
                    loading={isLoading}
                    onClick={() => onSelect(suspect.id)}
                  >
                    <Translate pt="Selecionar" en="Select" />
                  </Button>
                </Space>
              );
            })}
          </Space>
        </Image.PreviewGroup>
      </Space>
    </>
  );
};
