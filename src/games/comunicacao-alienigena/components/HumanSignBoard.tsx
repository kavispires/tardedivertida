import { Popconfirm } from 'antd';
import { TransparentButton } from 'components/buttons';
import { DrawingCanvas } from 'components/canvas';

import { DualTranslate, Translate } from 'components/language';
import { useCache } from 'hooks/useCache';

type HumanSignBoardProps = {
  signs: Sign[];
};

export function HumanSignBoard({ signs }: HumanSignBoardProps) {
  const { cache, setCache } = useCache();

  const updateCache = (signId: number | string, content: CanvasLine[]) => {
    setCache((prev) => {
      const copy = { ...prev };
      copy[signId] = content ?? [];
      return copy;
    });
  };

  return (
    <div>
      <div className="signs-grid">
        {signs.map((sign) => (
          <div className="signs-grid__item">
            <Popconfirm
              title={<Translate pt="Apagar símbolo" en="Erase symbol" />}
              onConfirm={() => updateCache(sign.signId, [])}
              okText={<Translate pt="Sim" en="Yes" />}
              cancelText={<Translate pt="Não" en="No" />}
            >
              <TransparentButton>
                <DualTranslate>{sign.attribute}</DualTranslate>
              </TransparentButton>
            </Popconfirm>
            <DrawingCanvas
              lines={cache[sign.signId] ?? []}
              setLines={(content: any) => updateCache(sign.signId, content)}
              width={60}
              height={60}
              showControls={false}
              strokeWidth="small"
              className="signs-grid__canvas"
            />
          </div>
        ))}
      </div>
      <div className="signs-grid__item">
        <Popconfirm
          title={<Translate pt="Apagar símbolo" en="Erase symbol" />}
          onConfirm={() => updateCache('unknown', [])}
          okText={<Translate pt="Sim" en="Yes" />}
          cancelText={<Translate pt="Não" en="No" />}
        >
          <TransparentButton>
            <Translate pt="Símbolos Desconhecidos" en="Unknown Symbols" />
          </TransparentButton>
        </Popconfirm>
        <DrawingCanvas
          lines={cache['unknown'] ?? []}
          setLines={(content: any) => updateCache('unknown', content)}
          width={390}
          height={60}
          showControls={false}
          strokeWidth="small"
          className="signs-grid__canvas"
          willReadFrequently
        />
      </div>
    </div>
  );
}
