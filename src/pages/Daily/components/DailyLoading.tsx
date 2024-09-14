// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Loading } from 'components/loaders';
// Internal
import { DailyChrome } from './DailyChrome';

export function DailyLoading() {
  const { translate } = useLanguage();
  return (
    <DailyChrome>
      <div className="daily-loading">
        <Space className="space-container">
          <Loading message={translate('Carregando desafio...', 'Loading challenge...')} margin />
        </Space>
      </div>
    </DailyChrome>
  );
}
