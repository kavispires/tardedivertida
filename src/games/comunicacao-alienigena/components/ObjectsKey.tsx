// Components
import { Translate } from 'components/language';
// Internal
import { OfferingsStatus } from '../utils/types';

type ObjectsKeyProps = {
  status: OfferingsStatus;
};

export function ObjectsKey({ status }: ObjectsKeyProps) {
  return (
    <div className="objects-key">
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--UNKNOWN"></span>
        <span className="objects-key__text">
          <Translate pt="Desconhecido" en="Unknown" />
        </span>
        {/* TODO: add to status */}
        <span>Total: {25}</span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--ITEM"></span>
        <span className="objects-key__text">
          <Translate pt="O alienígena quer" en="Alien wants it" />
        </span>
        <span>
          <Translate pt="Entregues / Necessários" en="Delivered / Needed" />: {status.found} / {status.needed}
        </span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--CURSE"></span>
        <span className="objects-key__text">
          <Translate pt="O alienígena tem medo" en="Alien is afraid of it" />
        </span>
        <span>Amaldiçoados: {status.totalCurses}</span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--BLANK"></span>
        <span className="objects-key__text">
          <Translate pt="Alienígena não quis" en="Alien did not want it" />
        </span>
        <span>
          <Translate pt="Rodadas restantes" en="Rounds left" />: {status.timeLeft}
        </span>
      </div>
    </div>
  );
}
