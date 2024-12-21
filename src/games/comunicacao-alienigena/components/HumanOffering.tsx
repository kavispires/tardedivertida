import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { RuleInstruction } from 'components/text';
// Internal
import type { Item, OfferingsStatus, Sign } from '../utils/types';
import { CurseItemHighlight, ItemsHighlight } from './Highlights';
import { HumanSignBoard } from './HumanSignBoard';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';

type HumanOfferingProps = {
  signs: Sign[];
  startingAttributes: Sign[];
  items: Item[];
  submitOffer: GenericFunction;
  user: GamePlayer;
  status: OfferingsStatus;
};

export function HumanOffering({
  signs,
  items,
  submitOffer,
  user,
  status,
  startingAttributes,
}: HumanOfferingProps) {
  const [offeringId, setSelected] = useState('');

  return (
    <Space className="space-container" direction="vertical">
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              <strong>Selecione</strong> um objeto e aperte enviar. Lembre-se que que você tem que entregar{' '}
              <ItemsHighlight type="negative">{status.needed}</ItemsHighlight>
              objetos.
              <br />
              Você já entregou{' '}
              <ItemsHighlight type="positive">
                {status.found}/{status.needed}
              </ItemsHighlight>{' '}
              objetos e tem <TimeHighlight>{status.timeLeft}</TimeHighlight> chances sobrando. Dentre os
              objetos há <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight> objetos amaldiçoados
              que causará você perder uma chance adicional.
            </>
          }
          en={
            <>
              <strong>Select</strong> an object then press Submit. Remember that you must deliver{' '}
              <ItemsHighlight type="negative">{status.needed}</ItemsHighlight> objects.
              <br />
              You already delivered{' '}
              <ItemsHighlight type="positive">
                {status.found}/{status.needed}
              </ItemsHighlight>{' '}
              objects and have <TimeHighlight>{status.timeLeft}</TimeHighlight> chances left. Among the
              objects there are <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight> cursed objects
              that will cause the lost of one additional chance.
            </>
          }
        />
      </RuleInstruction>

      <Button size="large" type="primary" disabled={!offeringId} onClick={() => submitOffer({ offeringId })}>
        <Translate pt="Enviar Objeto" en="Submit Object" />
      </Button>

      <Space className="boards-container" wrap>
        <SelectableObjectsGrid
          items={items}
          selectedObjects={{ [offeringId]: true }}
          selectObject={setSelected}
          user={user}
          maxObjects={2}
          status={status}
        />
        <HumanSignBoard signs={signs} startingAttributes={startingAttributes} />
      </Space>
    </Space>
  );
}
