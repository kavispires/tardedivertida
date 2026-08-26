import { MetricsBoard } from '@games/medidas-nao-exatas/components/MetricsBoard';
import { LETTERS } from '@games/senso-literario/utils/constants';
// Types
import type { TextCardData } from 'types/tdr';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackMedidasNaoExatas = ({ track, onSubmitAnswer }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: -2 | -1 | 1 | 2) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.options, 'text'));
  });

  return (
    <>
      <MinigameTitle track={track} />
      <RuleInstruction type="action">
        <Translate
          pt="De acordo com as métricas abaixo, qual das duas opções melhor cai?"
          en="According to the metrics below, which of the two options fits better?"
        />
      </RuleInstruction>

      <MetricsBoard
        metricsDescriptors={track.data.metricsDescriptors}
        evaluations={track.data.evaluations}
        level={3}
      />

      <SpaceContainer>
        {track.data.options.map((card: TextCardData, index: number) => (
          <TransparentButton
            key={card.id}
            disabled={isLoading}
            onClick={() => onSubmitAnswer({ data: { value: card.text } })}
          >
            <TextCard
              header={LETTERS[index]}
              randomColor
            >
              {card.text}
            </TextCard>
          </TransparentButton>
        ))}
      </SpaceContainer>
    </>
  );
};
