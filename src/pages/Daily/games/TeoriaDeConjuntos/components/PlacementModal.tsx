import { Region } from 'pages/Daily/components/Region';
// Ant Design Resources
import { CaretDownOutlined } from '@ant-design/icons';
import { Flex, Modal } from 'antd';
// Components
import { Translate } from 'components/language';
// Internal
import type { useTeoriaDeConjuntosEngine } from '../utils/useTeoriaDeConjuntosEngine';
import { Thing } from './Thing';

type PlacementModalProps = Pick<
  ReturnType<typeof useTeoriaDeConjuntosEngine>,
  | 'activeThing'
  | 'activeArea'
  | 'onSelectArea'
  | 'onConfirmPlacement'
  | 'rule1Things'
  | 'rule2Things'
  | 'intersectingThings'
>;

export function PlacementModal({
  activeThing,
  activeArea,
  onSelectArea,
  onConfirmPlacement,
  rule1Things,
  rule2Things,
  intersectingThings,
}: PlacementModalProps) {
  const title = {
    1: <Translate pt="no círculo da esquerda" en="in the left circle?" />,
    2: <Translate pt="no círculo da direita" en="in the right circle?" />,
    0: <Translate pt="na interseção" en="in the intersection?" />,
    null: <Translate pt="" en="" />,
  }[String(activeArea)] ?? <Translate pt="" en="" />;

  const things =
    {
      1: rule1Things,
      2: rule2Things,
      0: intersectingThings,
      null: [],
    }[String(activeArea)] ?? [];

  return (
    <Modal
      title={
        <>
          <Translate
            pt={`Tem certeza que quer colocar ${activeThing?.name} `}
            en={`Are you sure you want to place ${activeThing?.name} `}
          />
          {title}
        </>
      }
      open
      onCancel={() => onSelectArea(null)}
      cancelText={<Translate pt="Não" en="No" />}
      onOk={() => onConfirmPlacement()}
      okText={<Translate pt="Sim" en="Yes" />}
    >
      <Region>
        {activeThing && <Thing itemId={activeThing?.id} name={activeThing?.name} width={50} />}
        <CaretDownOutlined />
        <Flex wrap="wrap" align="center" justify="center" gap={6} className="diagram-area-sample">
          {things.map((thing) => (
            <Thing key={thing.id} itemId={thing.id} name={thing.name} width={50} />
          ))}
        </Flex>
      </Region>
    </Modal>
  );
}
