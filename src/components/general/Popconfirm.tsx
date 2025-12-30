// Ant Design Resources
import { Popconfirm as AntPopConfirm, type PopconfirmProps } from 'antd';
// Components
import { Translate } from 'components/language';

type PopconfirmComponentProps = PopconfirmProps & {
  type?: 'yes-no' | 'default';
};

/**
 * A wrapper component around Ant Design's Popconfirm that provides localized cancel button text.
 *
 * @param props - All standard Ant Design PopconfirmProps
 * @returns A Popconfirm component with Portuguese/English translated cancel text
 *
 * @example
 * ```tsx
 * <Popconfirm
 *   title="Are you sure?"
 *   onConfirm={handleConfirm}
 * >
 *   <Button>Delete</Button>
 * </Popconfirm>
 * ```
 */
export function Popconfirm({ type, ...props }: PopconfirmComponentProps) {
  if (type === 'yes-no') {
    return (
      <AntPopConfirm
        {...props}
        okText={<Translate pt="Sim" en="Yes" />}
        cancelText={<Translate pt="Não" en="No" />}
      />
    );
  }

  return <AntPopConfirm {...props} cancelText={<Translate pt="Cancelar" en="Cancel" />} />;
}
