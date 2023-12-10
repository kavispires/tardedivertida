import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { RuleInstruction } from 'components/text';
import { CurseItemHighlight, ItemsHighlight } from './Highlights';
import { HumanSignBoard } from './HumanSignBoard';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';

type HumanOfferingProps = {
  signs: Sign[];
  items: Item[];
  submitOffer: GenericFunction;
  user: GamePlayer;
  status: OfferingsStatus;
};

export function HumanOffering({ signs, items, submitOffer, user, status }: HumanOfferingProps) {
  const [offeringId, setSelected] = useState('');

  return (
    <Space className="space-container" direction="vertical">
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Selecione um objeto e aperte enviar. Lembre-se que que você tem que entregar{' '}
              <ItemsHighlight type="negative">{status.needed}</ItemsHighlight>
              objetos.
              <br />
              Você já entregou <ItemsHighlight type="positive">{status.found}</ItemsHighlight> objetos e tem{' '}
              <TimeHighlight>{status.timeLeft}</TimeHighlight> chances sobrando. Dentre os objetos há{' '}
              <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight> objetos amaldiçoados que causará
              você perder uma chance adicional.
            </>
          }
          en={
            <>
              Select an object then press Submit. Remember that you must deliver{' '}
              <ItemsHighlight type="negative">{status.needed}</ItemsHighlight> objects.
              <br />
              You already delivered <ItemsHighlight type="positive">{status.found}</ItemsHighlight> objects
              and have <TimeHighlight>{status.timeLeft}</TimeHighlight> chances left. Among the objects there
              are <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight> cursed objects that will cause
              the lost of one additional chance.
            </>
          }
        />
      </RuleInstruction>

      <Button
        size="large"
        type="primary"
        disabled={!Boolean(offeringId)}
        onClick={() => submitOffer({ offeringId })}
      >
        <Translate pt="Enviar Objeto" en="Submit Object" />
      </Button>

      <Space className="boards-container" wrap>
        <SelectableObjectsGrid
          items={items}
          selectedObjects={{ [offeringId]: true }}
          selectObject={setSelected}
          user={user}
          maxObjects={2}
        />
        <HumanSignBoard signs={signs} />
      </Space>
    </Space>
  );
}
