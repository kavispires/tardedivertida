import clsx from 'clsx';
import moment from 'moment';
import { useState } from 'react';
// Ant Design Resources
import { BellFilled } from '@ant-design/icons';
import { Button, Divider, Flex, Modal, Typography } from 'antd';
// Icons
import { BellIcon } from 'icons/BellIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
// Internal
import { NEWS_LIST } from './NewsList';

const NEWS_KEY = 'daily-news';

// Only use news that are today or earlier
const AVAILABLE_NEWS_LIST = NEWS_LIST.filter((item) => moment(item.date).isSameOrBefore(moment(), 'day'));

/**
 * Checks if the news modal should auto-open based on the last seen news date
 * and whether the latest news is today or after.
 *
 * @returns True if the modal should auto-open, false otherwise.
 */
const shouldAutoOpenNews = () => {
  const lastSeenNewsDate = localStorage.getItem(NEWS_KEY);

  // If no last seen date (first visit), should open
  if (!lastSeenNewsDate) return true;

  // Check if current news is newer than what user has seen
  const isTodayOrAfter = moment().isSameOrAfter(moment(AVAILABLE_NEWS_LIST[0].date), 'day');
  const hasNewContent = moment(AVAILABLE_NEWS_LIST[0].date).isAfter(moment(lastSeenNewsDate));

  return isTodayOrAfter && hasNewContent;
};

export function News() {
  const [open, setOpen] = useState(shouldAutoOpenNews());

  const onDismiss = () => {
    setOpen(false);
    localStorage.setItem(NEWS_KEY, AVAILABLE_NEWS_LIST[0].date);
  };

  return (
    <>
      <Button type="text" style={{ color: 'white' }} icon={<BellFilled />} onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={
          <Flex align="center" gap={8}>
            <IconAvatar icon={<BellIcon />} size="small" />
            <Translate pt="Novidades" en="News" />
          </Flex>
        }
        footer={
          <Button block type="primary" onClick={onDismiss}>
            <Translate pt="Ok" en="Ok" />
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
