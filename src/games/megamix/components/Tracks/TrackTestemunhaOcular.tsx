// Ant Design Resources
import { Button, Image, Space } from 'antd';
// Types
import type { SuspectCard as SuspectCardType } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { PlayerAvatar } from 'components/avatars';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { Card } from 'components/cards';
import { SuspectCard } from 'components/cards/SuspectCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
import { SpeechBubble } from 'components/text/SpeechBubble';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

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
        <RuleInstruction type="action">
          <Translate
            pt="Uma testemunha deu essa resposta ao tentar falar quem era o criminoso à polícia."
            en="A witness gave this answer when trying to explain who the perpetrator was to the police."
          />
        </RuleInstruction>

        <Card header={translate('Pergunta', 'Question')} color="orange">
          {track.data.question.question}
        </Card>

        <SpaceContainer>
          <PlayerAvatar avatarId="A" size="large" />{' '}
          <SpeechBubble shadow size="small">
            {track.data.answer ? <Translate en="YES" pt="SIM" /> : <Translate en="NO" pt="NÃO" />}{' '}
            <IconAvatar
              size="large"
              icon={track.data.answer ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
            />
          </SpeechBubble>
        </SpaceContainer>

        <RuleInstruction type="action">
          <Translate
            pt="Qual dos suspeito você acha que é o criminoso?"
            en="Which one of them is the perpetrator?"
          />
        </RuleInstruction>

        <Image.PreviewGroup>
          <SpaceContainer>
            {track.data.suspects.map((suspect: SuspectCardType) => {
              return (
                <SpaceContainer vertical key={suspect.id}>
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
                </SpaceContainer>
              );
            })}
          </SpaceContainer>
        </Image.PreviewGroup>
      </Space>
    </>
  );
};
