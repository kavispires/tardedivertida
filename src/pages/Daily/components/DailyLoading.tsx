// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Loading } from 'components/loaders';
// Internal
import { DailyChrome } from './DailyChrome';

export function DailyLoading() {
  const { translate } = useLanguage();
  return (
    <DailyChrome>
      <div className="daily-loading">
        <SpaceContainer>
          <Loading message={translate('Carregando desafio...', 'Loading challenge...')} margin />
        </SpaceContainer>
      </div>
    </DailyChrome>
  );
}
