// Ant Design Resources
import { Button, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
// Utils
import { useBlurCards } from 'hooks/useBlurCards';
// Components
import { Translate } from 'components/language';
// Sass
import './ImageBlurButton.scss';

type ImageBlurButtonProps = {
  /**
   * The card to be blurred
   */
  cardId: string;
};

export function ImageBlurButton({ cardId }: ImageBlurButtonProps) {
  const { blurCard, isBlurEnabled, shouldBeBlurred } = useBlurCards();

  return isBlurEnabled ? (
    <Tooltip
      placement="top"
      title={
        <Translate
          pt="Aperte o botão para embaçar a foto caso você tenha alguma fobia"
          en="Use this button to blur the image in case of any phobia"
        />
      }
    >
      <Button ghost onClick={() => blurCard(cardId)} size="small" className="image-blur-button">
        {shouldBeBlurred(cardId) ? (
          <>
            <EyeOutlined /> <Translate pt="Descredar" en="Focus" />
          </>
        ) : (
          <>
            <EyeInvisibleOutlined /> <Translate pt="Credo" en="Blur" />
          </>
        )}
      </Button>
    </Tooltip>
  ) : (
    <></>
  );
}
