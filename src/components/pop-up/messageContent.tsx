// Ant Design Resources
import { message } from 'antd';
// Components
import { VideoGameControllerIcon } from 'components/icons/VideoGameControllerIcon';
import { Translate } from 'components/language';

/**
 * Pops up a modal with a confirmation button but also closing timeout
 * @param title
 * @param description
 * @param id
 * @param duration
 * @returns
 */
export const messageContent = (title: string, description: string, id: string, duration = 30) => {
  const key = `${id} - ${title}`;

  return {
    content: (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>
          <small>
            <Translate
              pt="Popup fecha automaticamente ou clique para fechar"
              en="Auto-close or click to close"
            />
          </small>
        </p>
      </div>
    ),
    top: window.innerWidth / 2 - 100,
    duration,
    key,
    icon: <VideoGameControllerIcon style={{ width: '64px' }} />,
    onClick: () => message.destroy(key),
  };
};
