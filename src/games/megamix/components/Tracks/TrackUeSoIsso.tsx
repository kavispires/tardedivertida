// Ant Design Resources
import { Space } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackUeSoIsso = ({ track, onSubmitAnswer }: TrackProps) => {
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
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Jogando <strong>Ué, Só Isso</strong>, você recebeu as seguintes pistas que estão de alguma
                forma relacionadas à palavra secreta:
              </>
            }
            en={
              <>
                Playing the game <strong>That's it</strong>, you received the following clues that are somehow
                related to the secret word:
              </>
            }
          />
        </RuleInstruction>

        <SpaceContainer wrap>
          {track.data.options.map((option: string) => (
            <SuggestionEasel id={option} key={option} value={option} />
          ))}
        </SpaceContainer>

        <RuleInstruction type="action">
          <Translate pt="Qual você acha que é a palavra secreta?" en="Which one is the secret word?" />
        </RuleInstruction>

        <SpaceContainer>
          {track.data.cards.map((card: TextCard, index: number) => (
            <TransparentButton key={card.id} disabled={isLoading} onClick={() => onSubmitClue(card.text)}>
              <Card header={LETTERS[index]} randomColor>
                {card.text}
              </Card>
            </TransparentButton>
          ))}
        </SpaceContainer>
      </Space>
    </>
  );
};
