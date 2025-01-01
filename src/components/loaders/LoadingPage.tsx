import { motion } from 'framer-motion';
// Ant Design Resources
import { Typography } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { AnimatedVideoConferenceIcon } from 'icons/AnimatedVideoConferenceIcon';
// Components
import { DualTranslate } from 'components/language';
import { LoadingPageLayout } from 'components/layout/PageLayout';

const Text = motion(Typography.Text);

type LoadingPageProps = {
  /**
   * The message to show to the user
   */
  message?: DualLanguageValue;
};

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <LoadingPageLayout className="loading-page">
      <AnimatedVideoConferenceIcon style={{ width: '120px' }} />
      {message && (
        <Text {...getAnimation('blink', { infinite: true })}>
          <DualTranslate>{message}</DualTranslate>
        </Text>
      )}
    </LoadingPageLayout>
  );
}
