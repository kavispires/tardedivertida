// AntDesign Resources
import { Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../../utils/mock';
import { LETTERS } from 'utils/constants';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { TransparentButton } from 'components/buttons';

export const TrackUeSoIsso = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSubmitClue = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSubmitClue(mockSelection(track.data.cards, 'text'));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Ué, só isso?', en: "That's it?" }} />
      <Space direction="vertical" align="center" className="contained margin">
        <Instruction contained>
          <Translate
            pt={
              <>
                Jogando <strong>Ué, Só Isso</strong>, os outros jogadores deram as seguintes dicas:
              </>
            }
            en={
              <>
                Playing <strong>Ué, Só Isso</strong>, the other players gave the following clues:
              </>
            }
          />
        </Instruction>

        <Space className="space-container" wrap>
          {track.data.options.map((option: string) => (
            <SuggestionEasel id={option} key={option} value={option} />
          ))}
        </Space>

        <Instruction contained>
          <Translate
            pt="Qual você acha que é a resposta correta?"
            en="Which one do you think is the correct answer?"
          />
        </Instruction>

        <Space className="space-container">
          {track.data.cards.map((card: TextCard, index: number) => (
            <TransparentButton key={card.id} disabled={isLoading} onClick={() => onSubmitClue(card.text)}>
              <Card header={LETTERS[index]} randomColor>
                {card.text}
              </Card>
            </TransparentButton>
          ))}
        </Space>
      </Space>
    </>
  );
};
