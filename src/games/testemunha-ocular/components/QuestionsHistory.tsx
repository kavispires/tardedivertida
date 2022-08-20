// Ant Design Resources
import { Tooltip } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { CollapsibleRule } from 'components/rules';
import { IconAvatar } from 'components/icons/IconAvatar';
import { SpeechBubbleDeclinedIcon } from 'components/icons/SpeechBubbleDeclinedIcon';
import { SpeechBubbleAcceptedIcon } from 'components/icons/SpeechBubbleAcceptedIcon';

type QuestionsHistoryProps = {
  history: THistoryEntry[];
};

export function QuestionsHistory({ history }: QuestionsHistoryProps) {
  const { translate } = useLanguage();

  return (
    <CollapsibleRule title={translate('Respostas Anteriores', 'Previous Answers')}>
      <ol>
        {history.map((entry) => (
          <li key={`history-entry-${entry.id}`} className="t-history__entry">
            <span className="t-history__question">{entry.question}</span>
            {entry.answer ? (
              <Tooltip title={translate('Sim', 'Yes')} className="t-history__icon">
                <IconAvatar icon={<SpeechBubbleAcceptedIcon />} size="small" />
              </Tooltip>
            ) : (
              <Tooltip title={translate('Não', 'No')} className="t-history__icon">
                <IconAvatar icon={<SpeechBubbleDeclinedIcon />} size="small" />
              </Tooltip>
            )}
          </li>
        ))}
      </ol>
    </CollapsibleRule>
  );
}
