import clsx from 'clsx';
import { parse, format, isAfter, isBefore, startOfDay } from 'date-fns';
import { useState } from 'react';
// Ant Design Resources
import { BellFilled } from '@ant-design/icons';
import { Button, Divider, Flex, Modal, Typography } from 'antd';
// Icons
import { BellIcon } from '@icons/BellIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
// Internal
import { NEWS_LIST } from './NewsList';
import { usePreference } from '../hooks/useDailyPreferences';

const UP_TO_TODAY_NEWS_LIST = NEWS_LIST.filter((item) => {
  const itemDate = parse(item.date, 'yyyy-MM-dd', new Date());
  const today = startOfDay(new Date());
  // isSameOrBefore day granularity: not after today
  return !isAfter(startOfDay(itemDate), today);
});

// Filtered news list based on exact dates and today
const AVAILABLE_NEWS_LIST = (() => {
  const today = format(new Date(), 'yyyy-MM-dd');

  return UP_TO_TODAY_NEWS_LIST.filter((item) => {
    // If exact is true, only include if date matches today
    if (item.exact) {
      return item.date === today;
    }
    // Otherwise, include the item
    return true;
  });
})();

/**
 * Checks if the news modal should auto-open based on the last seen news date
 * and whether the latest news is today or after.
 *
 * @returns True if the modal should auto-open, false otherwise.
 */
const shouldAutoOpenNews = () => {
  const [lastSeenNewsDate] = usePreference('lastNewsCheck');

  // If no last seen date (first visit), should open
  if (!lastSeenNewsDate) return true;

  // Check if current news is newer than what user has seen
  const newsDate = parse(AVAILABLE_NEWS_LIST[0].date, 'yyyy-MM-dd', new Date());
  const today = startOfDay(new Date());
  const lastSeen = parse(lastSeenNewsDate, 'yyyy-MM-dd', new Date());

  // isSameOrAfter day granularity: not before the news date
  const isTodayOrAfter = !isBefore(today, startOfDay(newsDate));
  const hasNewContent = isAfter(startOfDay(newsDate), startOfDay(lastSeen));

  return isTodayOrAfter && hasNewContent;
};

export function News() {
  const [open, setOpen] = useState(shouldAutoOpenNews());
  const [, setLastSeenNewsDate] = usePreference('lastNewsCheck');

  const onDismiss = () => {
    setOpen(false);
    setLastSeenNewsDate(AVAILABLE_NEWS_LIST[0].date);
  };

  return (
    <>
      <Button
        type="text"
        style={{ color: 'white' }}
        icon={<BellFilled />}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        onCancel={onDismiss}
        title={
          <Flex
            align="center"
            gap={8}
          >
            <Icon
              icon={<BellIcon />}
              size="small"
            />
            <Translate
              pt="Novidades"
              en="News"
            />
          </Flex>
        }
        footer={
          <Button
            block
            type="primary"
            onClick={onDismiss}
          >
            <Translate
              pt="Ok"
              en="Ok"
            />
          </Button>
        }
      >
        <div className="daily-news-list">
          {AVAILABLE_NEWS_LIST.map((item, index) => (
            <div key={item.date}>
              <div className={clsx('daily-news-item', { 'daily-news-item--highlighted': index === 0 })}>
                <Typography.Text type="secondary">{item.date}</Typography.Text>
                <div className="news-content">{item.content}</div>
              </div>
              <Divider className="my-4" />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
