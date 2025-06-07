import clsx from 'clsx';
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

export function News() {
  const [open, setOpen] = useState(localStorage.getItem(NEWS_KEY) !== NEWS_LIST[0].date);

  const onDismiss = () => {
    setOpen(false);
    localStorage.setItem(NEWS_KEY, NEWS_LIST[0].date);
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
          {NEWS_LIST.map((item, index) => (
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
