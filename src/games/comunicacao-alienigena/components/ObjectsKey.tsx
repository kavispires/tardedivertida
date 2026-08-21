// Ant Design Resources
import { Tag } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
// Internal
import type { OfferingsStatus } from '../utils/types';

type ObjectsKeyProps = {
  status: OfferingsStatus;
};

export function ObjectsKey({ status }: ObjectsKeyProps) {
  return (
    <div className="objects-key">
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--UNKNOWN"></span>
        <span className="objects-key__text">
          <Translate
            en="Unknown"
            pt="Desconhecido"
          />
        </span>
        {/* TODO: add to status */}
        <span>
          Total: <Tag>{25}</Tag>
        </span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--ITEM"></span>
        <span className="objects-key__text">
          <Translate
            en="Alien wants it"
            pt="O alienígena quer"
          />
        </span>
        <span>
          <Translate
            en="Delivered / Needed"
            pt="Entregues / Necessários"
          />
          :{' '}
          <Tag>
            {status.found} / {status.needed}
          </Tag>
        </span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--CURSE"></span>
        <span className="objects-key__text">
          <Translate
            en="Alien is afraid of it"
            pt="O alienígena tem medo"
          />
        </span>
        <span>
          Amaldiçoados:{' '}
          <Tag>
            {Object.keys(status.curses).length}/{status.totalCurses}
          </Tag>
        </span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--BLANK"></span>
        <span className="objects-key__text">
          <Translate
            en="Alien did not want it"
            pt="Alienígena não quis"
          />
        </span>
        <span>
          <Translate
            en="Rounds left"
            pt="Rodadas restantes"
          />
          : <Tag>{status.timeLeft}</Tag>
        </span>
      </div>
    </div>
  );
}
