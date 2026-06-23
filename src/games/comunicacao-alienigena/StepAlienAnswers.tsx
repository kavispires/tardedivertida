import { useMemo, useState } from 'react';
// Ant Design Resources
import { Flex, Select, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from '@hooks/useGlobalState';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
// Icons
import { ArrowIcon } from '@icons/ArrowIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { SendButton } from '@components/buttons/SendButton';
import { ItemCard } from '@components/cards/ItemCard';
import { SignCard } from '@components/cards/SignCard';
import { DebugOnly } from '@components/debug/DebugOnly';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayerAvatarStrip } from '@components/player/PlayerAvatarStrip';
import { PlayerFlex } from '@components/player/PlayerFlex';
import { PopoverRule } from '@components/rules/PopoverRule';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import type { AlienAttribute } from '@components/toolKits/AlienAttributes/alien-attributes';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type {
  InquiryHistoryEntry,
  PhaseBasicState,
  RequestHistoryEntry,
  SubmitAlienResponsesPayload,
  OfferingsStatus,
} from './utils/types';
import { MAX_INQUIRY_OBJECTS, SPRITE_SIZE } from './utils/constants';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { History } from './components/History';
import { Status } from './components/Status';
import { BotPopupRule } from './components/BotPopupRules';
import { AnswerSuggestions } from './components/Suggestions';

type StepAlienAnswersProps = {
  players: GamePlayers;
  onSubmitAlienResponse: (payload: SubmitAlienResponsesPayload) => void;
  alien: GamePlayer;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  inquiries: InquiryHistoryEntry[];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  alienResponses?: Dictionary<string>;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepAlienAnswers({
  players,
  announcement,
  onSubmitAlienResponse,
  items,
  attributes,
  alien,
  inquiries,
  alienResponses,
  requestHistory,
  inquiryHistory,
  status,
  isAlienBot,
  startingAttributesIds,
  debugMode,
}: StepAlienAnswersProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  const hasAlienResponse = Boolean(alienResponses && Object.keys(alienResponses).length > 0);

  // inquiryId : spriteId
  const [selections, setSelections] = useState(
    inquiries.reduce(
      (acc, inquiry) => {
        acc[inquiry.id] = '';
        return acc;
      },
      {} as Record<UID, string>,
    ),
  );
  const [activePlayerId, setActivePlayerId] = useState<UID | null>(null);

  const { attributesDict, attributeSpriteOptions } = useMemo(() => {
    return {
      attributesDict: attributes.reduce((acc: Dictionary<AlienAttribute>, attribute) => {
        acc[attribute.id] = attribute;
        return acc;
      }, {}),
      attributeSpriteOptions: attributes.map((attribute) => ({
        label: translate(attribute.name),
        value: attribute.spriteId,
      })),
    };
  }, [attributes, translate]);

  const activeObjects = useMemo(() => {
    if (!activePlayerId) return [];
    const activeInquiry = inquiries.find((inquiry) => inquiry.playerId === activePlayerId);
    return activeInquiry ? activeInquiry.objectIds : [];
  }, [activePlayerId, inquiries]);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait={hasAlienResponse}>
        {hasAlienResponse ? (
          <Translate
            pt={
              <>
                Alienígena <PlayerAvatarName player={alien} /> respondeu
              </>
            }
            en={
              <>
                Alien <PlayerAvatarName player={alien} /> answered
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                Alienígena <PlayerAvatarName player={alien} /> responde
              </>
            }
            en={
              <>
                Alien <PlayerAvatarName player={alien} /> answers
              </>
            }
          />
        )}
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      {!hasAlienResponse ? (
        <RuleInstruction type="rule">
          <Translate
            pt="Para cada jogador humano, o alienígena deve dizer qual símbolo o grupo de objetos dado
                representa"
            en="For each human player, the alien must say which symbol best represents the given group of
                objects"
          />
        </RuleInstruction>
      ) : (
        <RuleInstruction type="wait">
          <Translate
            pt="Aguarde enquanto os outros jogadores anotam os símbolos."
            en="Wait while the other players take note of the symbols."
          />
        </RuleInstruction>
      )}

      <Flex
        vertical
        gap={6}
      >
        {inquiries.map((inquiry, index) => {
          const player = players[inquiry.playerId];

          return (
            <PlayerFlex
              key={index}
              avatarId={player.avatarId}
              gap={8}
              align="center"
              withBorder
              className="border-radius p-1"
              onMouseEnter={() => setActivePlayerId(player.id)}
              onMouseLeave={() => setActivePlayerId(null)}
            >
              {/* Avatar */}
              <PlayerAvatarStrip player={player} />

              {/* Inquiry Objects */}
              {inquiry.objectIds.map((objectId) => (
                <ItemCard
                  key={`inquiry-${objectId}`}
                  itemId={objectId}
                  width={SPRITE_SIZE}
                />
              ))}
              {Array(MAX_INQUIRY_OBJECTS - inquiry.objectIds.length)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`inquiry-placeholder-${i}`}
                    style={{ width: SPRITE_SIZE, height: SPRITE_SIZE }}
                  />
                ))}

              <IconAvatar
                icon={<ArrowIcon />}
                size="small"
              />

              {inquiry.answer || selections[inquiry.id] || alienResponses?.[inquiry.id] ? (
                <Flex
                  justify="center"
                  align="center"
                  className="border-radius"
                  style={{
                    width: SPRITE_SIZE,
                    height: SPRITE_SIZE,
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <SignCard
                    signId={
                      (inquiry.answer || selections?.[inquiry.id] || alienResponses?.[inquiry.id]) ?? ''
                    }
                    className="transparent"
                    width={SPRITE_SIZE}
                  />
                </Flex>
              ) : (
                <Flex
                  justify="center"
                  align="center"
                  className="border-radius"
                  style={{
                    width: SPRITE_SIZE,
                    height: SPRITE_SIZE,
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  ?
                </Flex>
              )}

              {!hasAlienResponse && (
                <>
                  <Select
                    options={attributeSpriteOptions}
                    style={{ width: 120 }}
                    placeholder={translate({ pt: 'Selecione um símbolo', en: 'Select a symbol' })}
                    value={selections[inquiry.id]}
                    onChange={(value) =>
                      setSelections((prev) => ({
                        ...prev,
                        [inquiry.id]: value,
                      }))
                    }
                  />
                  <AnswerSuggestions
                    suggestions={inquiry.suggestions || []}
                    attributesDict={attributesDict}
                    onSelect={(spriteId) =>
                      setSelections((prev) => ({
                        ...prev,
                        [inquiry.id]: spriteId,
                      }))
                    }
                  />
                </>
              )}
            </PlayerFlex>
          );
        })}
      </Flex>

      <ViewIf condition={!hasAlienResponse}>
        <SendButton
          size="large"
          onClick={() => onSubmitAlienResponse({ alienResponses: selections })}
          disabled={isLoading || Object.values(selections).some((selection) => selection === '')}
          className="mt-4"
        >
          <Translate
            pt="Enviar respostas"
            en="Submit answers"
          />
        </SendButton>
      </ViewIf>

      <Space
        className="boards-container"
        wrap
      >
        <ObjectsGrid
          items={items}
          showTypes
          activeObjects={activeObjects}
          status={status}
        />
        <SignsKeyCard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          inquiryHistory={inquiryHistory}
        />
      </Space>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={isAlienBot}
        attributes={attributes}
        showIntention={isDebugEnabled}
        debugMode={debugMode}
      />

      <DebugOnly>
        <SignsKeyCard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          inquiryHistory={inquiryHistory}
        />
      </DebugOnly>
    </Step>
  );
}
