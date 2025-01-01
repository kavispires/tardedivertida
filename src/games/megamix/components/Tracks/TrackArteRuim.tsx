// Ant Design Resources
import { Button } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromIndex } from 'utils/helpers';
// Components
import { TransparentButton } from 'components/buttons';
import { CanvasSVG } from 'components/canvas';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackArteRuim = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const cardWidth = useCardWidth(5, {
    minWidth: 250,
    maxWidth: 270,
  });
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    if (track.variant === 'cards') {
      onSelect(mockSelection(track.data.cards, 'id'));
    }

    if (track.variant === 'drawings') {
      onSelect(mockSelection(track.data.options, 'playerId'));
    }
  });

  if (track.variant === 'cards') {
    return (
      <>
        <MinigameTitle title={{ pt: 'Arte Ruim Pra Dedéu', en: 'Questionable Art' }} />
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Dentre as cartas abaixo, qual melhor descreve essa linda ilustração?
                <br />
                Foi você quem desenhou? Lembre-se que a resposta correta não é importante, e sim o que a
                maioria escolher.
              </>
            }
            en={
              <>
                Among the cards below, which one best describes the beautiful illustration?
                <br />
                <em>
                  Is that your drawing? Remember that the correct answer is not important, but what the
                  majority will choose.
                </em>
              </>
            }
          />
        </RuleInstruction>

        <SpaceContainer>
          <CanvasSVG drawing={track.data.option.drawing} width={cardWidth} className="a-drawing" />
        </SpaceContainer>

        <SpaceContainer>
          {track.data.cards.map((card: TextCard, index: number) => (
            <TransparentButton
              key={card.id}
              disabled={isLoading || user.ready}
              onClick={() =>
                onSubmitAnswer({
                  data: { value: card.id },
                })
              }
            >
              <Card header={LETTERS[index]} color={getColorFromIndex(index)}>
                {card.text}
              </Card>
            </TransparentButton>
          ))}
        </SpaceContainer>
      </>
    );
  }

  return (
    <>
      <MinigameTitle title={{ pt: 'Arte Ruim Pra Dedéu', en: 'Questionable Art' }} />
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Dentre as ilustrações abaixo, qual melhor descreve a carta?
              <br />
              Foi você quem desenhou? Lembre-se que a resposta correta não é importante, e sim o que a maioria
              escolher.
            </>
          }
          en={
            <>
              Among the illustrations below, which one best fits the card?
              <br />
              <em>
                Is that your drawing? Remember that the correct answer is not important, but what the majority
                will choose.
              </em>
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        <Card header="A" color={getColorFromIndex(0)}>
          {track.data.cards[1].text}
        </Card>
      </SpaceContainer>

      <div className="a-drawings">
        {track.data.options.map((entry: PlainObject) => (
          <div key={String(entry)} className="a-drawings__entry">
            <CanvasSVG drawing={entry.drawing} width={cardWidth} className="a-drawing" />

            <SpaceContainer>
              <Button
                shape="round"
                type="primary"
                disabled={user.ready}
                loading={isLoading}
                onClick={() => onSelect(entry.playerId)}
              >
                <Translate pt="Selecionar" en="Select" />
              </Button>
            </SpaceContainer>
          </div>
        ))}
      </div>
    </>
  );
};
