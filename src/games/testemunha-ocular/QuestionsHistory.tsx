// Design Resources
import { Tooltip } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { AvatarIcon, CollapsibleRule } from 'components';

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
                <AvatarIcon type="speech-bubble-accepted" size="small" />
              </Tooltip>
            ) : (
              <Tooltip title={translate('Não', 'No')} className="t-history__icon">
                <AvatarIcon type="speech-bubble-declined" size="small" />
              </Tooltip>
            )}
          </li>
        ))}
      </ol>
    </CollapsibleRule>
  );
}
