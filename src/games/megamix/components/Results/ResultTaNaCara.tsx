// Icons
import { SpeechBubbleAcceptedIcon } from '@icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from '@icons/SpeechBubbleDeclinedIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultTaNaCara({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="As respostas votadas foram"
            en="Most voted answers are"
          />
        ) : (
          <Translate
            pt="A resposta mais votada foi"
            en="Most voted answer is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div
            key={`answer-${value}`}
            className="track-result-values__text-value"
          >
            <Icon
              size="large"
              icon={value === 'yes' ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
            />
          </div>
        ))}
      </div>
    </>
  );
}
