import { Space } from 'antd';
import { Loading } from 'components/loaders';
import { useLanguage } from 'hooks/useLanguage';

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
