import clsx from 'clsx';
// Ant Design Resources
import { Button, Tooltip } from 'antd';
import { EyeInvisibleOutlined } from '@ant-design/icons';
// Utils
import { useBlurCards } from 'hooks';
// Components
import { Translate } from 'components';

type ImageBlurButtonProps = {
  cardId: string;
};

export function ImageBlurButton({ cardId }: ImageBlurButtonProps) {
  const [, addBlurCard, blurEnabled] = useBlurCards();

  return blurEnabled ? (
    <Tooltip
      placement="top"
      title={
        <Translate
          pt="Aperte o botão para embaçar a foto caso você tenha alguma fobia"
          en="Use this button to blur the image in case of any phobia"
        />
      }
    >
      <Button ghost onClick={() => addBlurCard(cardId)} size="small" className="image-blur-button">
        <EyeInvisibleOutlined /> <Translate pt="Credo" en="Blur" />
      </Button>
    </Tooltip>
  ) : (
    <></>
  );
}

type ImageBlurButtonContainerProps = {
  cardId: string;
  className?: string;
  children: any;
  [key: string]: any;
};

export function ImageBlurButtonContainer({
  cardId,
  className,
  children,
  ...props
}: ImageBlurButtonContainerProps) {
  return (
    <div className={clsx('image-blur-button-container', className)} {...props}>
      {children}
      <ImageBlurButton cardId={cardId} />
    </div>
  );
}
