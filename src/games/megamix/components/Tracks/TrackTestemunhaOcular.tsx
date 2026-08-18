// Ant Design Resources
import { Button, Image, Space } from 'antd';
// Types
import type { SuspectCardData as SuspectCardType } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Icons
import { SpeechBubbleAcceptedIcon } from '@icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from '@icons/SpeechBubbleDeclinedIcon';
// Components
import { SuspectCard } from '@components/cards/SuspectCard';
import { TextCard } from '@components/cards/TextCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { SpeechBubble } from '@components/text/SpeechBubble';
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
      <Space
        orientation="vertical"
        align="center"
        className="contained margin"
      >
        <RuleInstruction type="action">
          <Translate
            pt="Uma testemunha deu essa resposta ao tentar falar quem era o criminoso à polícia."
            en="A witness gave this answer when trying to explain who the perpetrator was to the police."
          />
        </RuleInstruction>

        <TextCard
          header={translate({ pt: 'Pergunta', en: 'Question' })}
          color="orange"
        >
          {track.data.question.statement}
        </TextCard>

        <SpaceContainer>
          <PlayerAvatar
            avatarId="A"
            size="large"
          />{' '}
          <SpeechBubble
            shadow
            size="small"
          >
            {track.data.answer ? (
              <Translate
                en="YES"
                pt="SIM"
              />
            ) : (
              <Translate
                en="NO"
                pt="NÃO"
              />
            )}{' '}
            <Icon
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
                <SpaceContainer
                  vertical
                  key={suspect.id}
                >
                  <SuspectCard
                    suspect={suspect}
                    width={cardWidth}
                  />

                  <Button
                    shape="round"
                    type="primary"
                    disabled={user.ready}
                    loading={isLoading}
                    onClick={() => onSelect(suspect.id)}
                  >
                    <Translate
                      pt="Selecionar"
                      en="Select"
                    />
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
