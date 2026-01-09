// Ant Design Resources
import { Badge, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { RuleInstruction } from 'components/text';
// Internal
import type { OfferingsStatus, PhaseBasicState, SubmitOfferingsPayload } from '../utils/types';
import { CurseItemHighlight, ItemsHighlight } from './Highlights';
import { HumanSignBoard } from './HumanSignBoard';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';

type HumanOfferingProps = {
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  submitOffer: (payload: SubmitOfferingsPayload) => void;
  user: GamePlayer;
  status: OfferingsStatus;
};

export function HumanOffering({
  items,
  attributes,
  submitOffer,
  user,
  status,
  startingAttributesIds,
}: HumanOfferingProps) {
  const {
    dict: offerings,
    updateDict: updateSelected,
    keys: offeringsIds,
  } = useBooleanDictionary({}, (d) => Object.keys(d).length <= 3);

  return (
    <SpaceContainer vertical>
      <Badge count={offeringsIds.length}>
        <SendButton
          size="large"
          disabled={!offeringsIds.length}
          onClick={() => submitOffer({ offeringsIds })}
        >
          <Translate
            pt={`Enviar ${pluralize(offeringsIds.length, 'Objeto')}`}
            en={`Submit  ${pluralize(offeringsIds.length, 'Object')}`}
          />
        </SendButton>
      </Badge>

      <Space
        className="boards-container"
        wrap
      >
        <SelectableObjectsGrid
          items={items}
          selectedObjects={offerings}
          selectObject={updateSelected}
          user={user}
          maxObjects={10}
          status={status}
        />
        <HumanSignBoard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
        />
      </Space>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
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
    </SpaceContainer>
  );
}
