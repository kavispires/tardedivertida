// Ant Design Resources
import { Tooltip } from 'antd';
// Icons
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { CollapsibleRule } from 'components/rules';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';

type QuestionsHistoryProps = {
  history: THistoryEntry[];
};

export function QuestionsHistory({ history }: QuestionsHistoryProps) {
  return (
    <CollapsibleRule title={<Translate pt="Respostas Anteriores" en="Previous Answers" />}>
      <ol>
        {history.map((entry) => (
          <li key={`history-entry-${entry.id}`} className="t-history__entry">
            <span className="t-history__question">{entry.question}</span>
            {entry.answer ? (
              <Tooltip title={<Translate pt="Sim" en="Yes" />} className="t-history__icon">
                <IconAvatar icon={<SpeechBubbleAcceptedIcon />} size="small" />
              </Tooltip>
            ) : (
              <Tooltip title={<Translate pt="Não" en="No" />} className="t-history__icon">
                <IconAvatar icon={<SpeechBubbleDeclinedIcon />} size="small" />
              </Tooltip>
            )}
          </li>
        ))}
      </ol>
    </CollapsibleRule>
  );
}
