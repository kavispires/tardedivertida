// Components
import { Translate } from 'components/language';

export function ObjectsKey() {
  return (
    <div className="objects-key">
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--UNKNOWN"></span>
        <span className="objects-key__text">
          <Translate pt="Desconhecido" en="Unknown" />
        </span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--ITEM"></span>
        <span className="objects-key__text">
          <Translate pt="Quer" en="Want" />
        </span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--CURSE"></span>
        <span className="objects-key__text">
          <Translate pt="Amaldiçoado" en="Cursed" />
        </span>
      </div>
      <div className="objects-key__entry">
        <span className="objects-key__example objects-key__example--BLANK"></span>
        <span className="objects-key__text">
          <Translate pt="Alienígena não quis" en="Alien did not want it" />
        </span>
      </div>
    </div>
  );
}
