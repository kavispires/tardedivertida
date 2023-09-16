// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { Card, ImageCard } from 'components/cards';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';

export const TrackTaNaCara = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
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
      <MinigameTitle title={{ pt: 'Tá Na Cara', en: 'Guess Who What?' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Você é a testemunha de um crime horrível. O detetive te fez essa pergunta sobre esse suspeito.
              <br />O que você responde?
            </>
          }
          en={
            <>
              You're the witness of a horrible crime. The detective asked you this question about the suspect.
              <br />
              what do you answer?
            </>
          }
        />
      </Instruction>

      <Card header={translate('Pergunta', 'Question')} color="orange">
        {track.data.question.question}
      </Card>

      <Space className="space-container" direction="vertical">
        <ImageCard
          imageId={track.data.suspect.id}
          className="t-suspects-table__suspect-image"
          cardWidth={cardWidth}
          preview={false}
        />
        <div className="t-suspects-table__suspect-name">
          <DualTranslate>{track.data.suspect.name}</DualTranslate>
        </div>
      </Space>

      <Space className="space-container">
        <Button
          size="large"
          icon={<SpeechBubbleDeclinedIcon />}
          onClick={() => onSelect('NO')}
          disabled={isLoading}
        >
          <Translate en="NO" pt="NÃO" />
        </Button>

        <Button
          size="large"
          icon={<SpeechBubbleAcceptedIcon />}
          onClick={() => onSelect('YES')}
          disabled={isLoading}
        >
          <Translate en="YES" pt="SIM" />
        </Button>
      </Space>
    </>
  );
};
