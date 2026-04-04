import { motion } from 'motion/react';
// Ant Design Resources
import { Typography } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { AnimatedVideoConferenceIcon } from 'icons/AnimatedVideoConferenceIcon';
// Components
import { DualTranslate } from 'components/language/DualTranslate';
import { LoadingPageLayout } from 'components/layout/PageLayout';
// Sass
import styles from './loaders.module.scss';

const Text = motion.create(Typography.Text);

type LoadingPageProps = {
  /**
   * The message to show to the user
   */
  message?: DualLanguageValue;
};

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <LoadingPageLayout className={styles.loadingPage}>
      <AnimatedVideoConferenceIcon style={{ width: '120px' }} />
      {message && (
        <Text {...getAnimation('blink', { infinite: true })}>
          <DualTranslate>{message}</DualTranslate>
        </Text>
      )}
    </LoadingPageLayout>
  );
}
