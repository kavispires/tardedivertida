// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Loading } from 'components/loaders/Loading';
// Internal
import { DailyChrome } from './DailyChrome';
import { DailyContent } from './DailyContent';

export function DailyLoading() {
  const { translate } = useLanguage();
  return (
    <DailyChrome>
      <DailyContent className="daily-loading">
        <SpaceContainer>
          <Loading
            message={translate({ pt: 'Carregando desafio...', en: 'Loading challenge...' })}
            margin
          />
        </SpaceContainer>
      </DailyContent>
    </DailyChrome>
  );
}
