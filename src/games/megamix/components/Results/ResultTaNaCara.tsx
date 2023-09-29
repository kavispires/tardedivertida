import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
import { IconAvatar } from 'components/avatars';

export function ResultTaNaCara({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="As respostas votadas foram" en="Most voted answers are" />
        ) : (
          <Translate pt="A resposta mais votada foi" en="Most voted answer is" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div key={`answer-${value}`} className="track-result-values__text-value">
            <IconAvatar
              size="large"
              icon={value === 'yes' ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
            />
          </div>
        ))}
      </div>
    </>
  );
}
