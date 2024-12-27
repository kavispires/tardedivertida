// Icons
import { AnimatedVideoConferenceIcon } from 'icons/AnimatedVideoConferenceIcon';
// Components
import { LoadingPageLayout } from 'components/general/PageLayout';

export function LoadingPage() {
  return (
    <LoadingPageLayout className="loading-page">
      <AnimatedVideoConferenceIcon style={{ width: '120px' }} />
    </LoadingPageLayout>
  );
}
