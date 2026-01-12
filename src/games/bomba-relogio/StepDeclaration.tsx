import { useState } from 'react';
// Ant Design Resources
import { InputNumber, Space, Tooltip } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { BombIcon } from 'icons/BombIcon';
import { WireIcon } from 'icons/WireIcon';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { DataCount, Status, SubmitDeclarationPayload } from './utils/types';
import { mockDeclaration } from './utils/mock';
import { RoleCard } from './components/RoleCard';
import { Tips } from './components/RulesBlobs';
import { Hand } from './components/Hand';

type StepDeclarationProps = {
  players: GamePlayers;
  user: GamePlayer;
  dataCount: DataCount;
  status: Status;
  nextInvestigator: GamePlayer;
  isTheNextInvestigator: boolean;
  onDeclare: (payload: SubmitDeclarationPayload) => void;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepDeclaration({
  announcement,
  user,
  dataCount,
  nextInvestigator,
  onDeclare,
  status,
}: StepDeclarationProps) {
  const { isLoading } = useLoading();
  const [bombsDeclared, setBombsDeclared] = useState<number>(0);
  const [wiresDeclared, setWiresDeclared] = useState<number>(0);

  useMock(() => {
    onDeclare({ declarations: mockDeclaration(user.id, user.role, user.hand, dataCount, status) });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Declare as cartas que você "tem"</>}
          en={<>Declare the cards you "have"</>}
        />
      </StepTitle>

      <RoleCard
        role={user?.role ?? ''}
        dataCount={dataCount}
      />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Declare quantos <strong>fios vermelhos</strong> e quantas <strong>bombas</strong> você quer que
              os outros jogadores saibam que você tem.
              <br />
              Minta à vontade!
              <br />
              <PlayerAvatarName
                player={nextInvestigator}
                addressUser
              />{' '}
              será o próximo investigador (caso isso influencie sua decisão).
            </>
          }
          en={
            <>
              Declare how many <strong>red wires</strong> and how many <strong>bombs</strong> you want the
              other players to know you have.
              <br />
              Lie as much as you want!
              <br />
              <PlayerAvatarName
                player={nextInvestigator}
                addressUser
              />{' '}
              will be the next investigator (if that influences your decision).
            </>
          }
        />
      </RuleInstruction>

      <Space
        align="center"
        className="my-4"
      >
        <Space.Compact>
          <Space.Addon>
            <Tooltip
              title={
                <Translate
                  pt="Número de fios vermelhos que você declara cortar"
                  en="Number of red wires you declare to cut"
                />
              }
            >
              <IconAvatar
                icon={<WireIcon />}
                size="small"
              />
            </Tooltip>
          </Space.Addon>
          <InputNumber
            defaultValue={0}
            style={{ width: '64px' }}
            min={0}
            max={5}
            size="large"
            onChange={(v) => setWiresDeclared(v ?? 0)}
            disabled={isLoading}
          />
        </Space.Compact>

        <Space.Compact>
          <Space.Addon>
            <Tooltip
              title={
                <Translate
                  pt="Número de bombas que você declara cortar"
                  en="Number of bombs you declare to cut"
                />
              }
            >
              <IconAvatar
                icon={<BombIcon />}
                size="small"
              />
            </Tooltip>
          </Space.Addon>
          <InputNumber
            defaultValue={0}
            style={{ width: '64px' }}
            min={0}
            max={1}
            size="large"
            onChange={(v) => setBombsDeclared(v ?? 0)}
            disabled={isLoading}
          />
        </Space.Compact>

        <SendButton
          size="large"
          onClick={() =>
            onDeclare({
              declarations: {
                bombs: bombsDeclared,
                wires: wiresDeclared,
                playerId: user.id,
              },
            })
          }
        >
          <Translate
            pt="Confirmar"
            en="Confirm"
          />
        </SendButton>
      </Space>

      <Hand
        hand={user.hand}
        dataCount={dataCount}
      />

      <Tips />
    </Step>
  );
}
