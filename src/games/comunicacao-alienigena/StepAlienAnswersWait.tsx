import { useMemo, useState } from 'react';
// Ant Design Resources
import { Flex, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useCacheV2 } from 'hooks/useCacheV2';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
// Icons
import { ArrowIcon } from 'icons/ArrowIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { SendButton } from 'components/buttons/SendButton';
import { ItemCard } from 'components/cards/ItemCard';
import { SignCard } from 'components/cards/SignCard';
import { DebugOnly } from 'components/debug/DebugOnly';
import { Translate } from 'components/language/Translate';
import { SpaceFloat } from 'components/layout/SpaceFloat';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { PlayerAvatarStrip } from 'components/player/PlayerAvatarStrip';
import { PlayerFlex } from 'components/player/PlayerFlex';
import { PopoverRule } from 'components/rules/PopoverRule';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type {
  InquiryHistoryEntry,
  PhaseBasicState,
  RequestHistoryEntry,
  OfferingsStatus,
  SubmitNotesConfirmationPayload,
} from './utils/types';
import { MAX_INQUIRY_OBJECTS, SPRITE_SIZE } from './utils/constants';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { History } from './components/History';
import { Status } from './components/Status';
import { BotPopupRule } from './components/BotPopupRules';

type StepAlienAnswersWaitProps = {
  players: GamePlayers;
  onConfirmNote: (payload: SubmitNotesConfirmationPayload) => void;
  user: GamePlayer;
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
  knownSpriteIds: string[];
} & Pick<StepProps, 'announcement'>;

export function StepAlienAnswersWait({
  players,
  announcement,
  user,
  onConfirmNote,
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
  knownSpriteIds,
  debugMode,
}: StepAlienAnswersWaitProps) {
  const { isLoading } = useLoading();
  const { cache } = useCacheV2<Dictionary<string>>({});
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  const hasAlienResponse = Boolean(alienResponses && Object.keys(alienResponses).length > 0) || isAlienBot;

  const [activePlayerId, setActivePlayerId] = useState<UID | null>(null);

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
      <StepTitle wait={!hasAlienResponse}>
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
                Alienígena <PlayerAvatarName player={alien} /> deve responder
              </>
            }
            en={
              <>
                Alien <PlayerAvatarName player={alien} /> must answer
              </>
            }
          />
        )}
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      {!hasAlienResponse ? (
        <RuleInstruction type="wait">
          <Translate
            pt="Para cada jogador humano, o alienígena deve dizer qual símbolo o grupo de objetos dado
                representa"
            en="For each human player, the alien must say which symbol best represents the given group of
                objects"
          />
        </RuleInstruction>
      ) : (
        <RuleInstruction type="action">
          <Translate
            pt="Anote os símbolos nos atributes que você acha que o alienígena quis dizer."
            en="Take note of the symbols on the attributes you think the alien meant."
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

              {inquiry.answer || alienResponses?.[inquiry.id] ? (
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
                    signId={(inquiry.answer || alienResponses?.[inquiry.id]) ?? ''}
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
            </PlayerFlex>
          );
        })}
      </Flex>

      <ViewIf condition={hasAlienResponse}>
        <SpaceFloat className="mt-4">
          <SendButton
            size="large"
            onClick={() => onConfirmNote({ notes: cache })}
            disabled={isLoading || user.ready}
          >
            <Translate
              pt="Anotei os símbolos e estou pronto"
              en="I took note of the symbols and I'm ready"
            />
          </SendButton>
        </SpaceFloat>
      </ViewIf>

      <Space
        className="boards-container"
        wrap
      >
        <ObjectsGrid
          items={items}
          activeObjects={activeObjects}
          status={status}
        />
        <HumanSignBoard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          knownSpriteIds={knownSpriteIds}
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
