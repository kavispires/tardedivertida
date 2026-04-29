import { useState } from 'react';
// Ant Design Resources
import { CheckCircleFilled, FireFilled, MinusCircleFilled } from '@ant-design/icons';
import {
  App,
  AutoComplete,
  Button,
  type ButtonProps,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd';
// Types
import type { GameState, GamePlayers } from 'types/game';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGameMeta } from 'hooks/useGameMeta';
import { useGlobalState } from 'hooks/useGlobalState';
import { useHostActionRequest } from 'hooks/useHostActionRequest';
import { useLoading } from 'hooks/useLoading';
// Services
import { HOST_API_ACTIONS } from 'services/adapters';
import { getFirestoreConsoleUrl } from 'services/firebase';
// Components
import { FixedMenuButton } from 'components/buttons/FixedMenuButton';
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language/Translate';
// Sass
import styles from './AdminMenuDrawer.module.scss';

type AdminMenuDrawerProps = {
  /**
   * The game state
   */
  state: GameState;
  /**
   * The game players
   */
  players: GamePlayers;
};

export const AdminMenuDrawer = ({ state, players }: AdminMenuDrawerProps) => {
  const { isLoading } = useLoading();
  const { isAdmin } = useCurrentUserContext();
  const [usingFirestoreEmulator] = useGlobalState('usingFirestoreEmulator');
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');
  const [visible, setVisible] = useState(false);
  const { meta } = useGameMeta();

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onPerformAdminAction = useHostActionRequest({
    actionName: 'perform-admin-action',
    successMessage: 'Admin action performed successfully',
    errorMessage: 'The selected admin action has failed',
    onAfterCall: onClose,
  });

  if (!isAdmin || !isAdminEnabled || !state.phase) return <span></span>;

  return (
    <div className={styles.adminMenuDrawer}>
      <FixedMenuButton
        position={-1}
        icon={<FireFilled />}
        type="button"
        label={
          <Translate
            pt=" Admin"
            en=" Admin"
          />
        }
        onClick={showDrawer}
        buttonProps={{
          type: 'default',
        }}
      />

      <Drawer
        title="Admin Menu"
        placement="left"
        closable={false}
        open={visible}
        onClose={onClose}
      >
        <ul>
          <PlayersReadyState players={players} />
          <li>
            <hr />
          </li>
          <li className={styles.buttons}>
            <h3>Actions</h3>
            <Popconfirm
              placement="right"
              title="Are you sure you want to go to the next phase?"
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.GO_TO_NEXT_PHASE })}
            >
              <AdminPerformActionButton
                disabled={isLoading || state.phase === 'GAME_OVER'}
                label="Force Next Phase"
                className={styles.button}
              />
            </Popconfirm>
            <Popconfirm
              placement="right"
              title="Are you sure you want to go to play again?"
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.PLAY_AGAIN })}
            >
              <AdminPerformActionButton
                // Not every game is currently working with this feature
                // disabled={isLoading || !(state.phase === 'GAME_OVER')}
                disabled
                label="Play Again"
                className={styles.button}
              />
            </Popconfirm>
            <Popconfirm
              placement="right"
              title="Are you sure you want to go to end the game by the end of this round?"
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.FORCE_END_GAME })}
            >
              <AdminPerformActionButton
                disabled={
                  state?.round?.forceLastRound || isLoading || ['LOBBY', 'GAME_OVER'].includes(state.phase)
                }
                label={
                  state?.round.forceLastRound
                    ? 'This is already set as the last round'
                    : 'Make this the last round'
                }
                className={styles.button}
              />
            </Popconfirm>
            <Popconfirm
              placement="right"
              title="Are you sure you want to go to the lobby and unlock the game?"
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.RESET_GAME })}
            >
              <AdminPerformActionButton
                disabled={state?.phase === 'LOBBY'}
                label="Reset and restart"
                className={styles.button}
              />
            </Popconfirm>
          </li>
          <li>
            <hr />
          </li>
          <li>
            <ForceStateForm
              isLoading={isLoading}
              onPerformAdminAction={onPerformAdminAction}
              state={state}
            />
          </li>
          <li>
            <hr />
          </li>
          <li>
            <h3>Firebase</h3>
            <Button
              target="_blank"
              href={getFirestoreConsoleUrl(
                `games/${meta.gameName}/${meta.gameId}/state`,
                !!usingFirestoreEmulator,
              )}
            >
              Visit Firebase Collection
            </Button>
          </li>
        </ul>
      </Drawer>
    </div>
  );
};

type AdminPerformActionButtonProps = ButtonProps & {
  /**
   * The label of the button
   */
  label: string;
};
const AdminPerformActionButton = ({ label, ...props }: AdminPerformActionButtonProps) => (
  <Button
    icon={<FireFilled />}
    type="primary"
    danger
    className="full-width"
    {...props}
  >
    {label}
  </Button>
);

type ValueType = 'string' | 'number' | 'boolean' | 'nullish';

type ValueFormItemProps = {
  /**
   * The input value type
   */
  valueType?: ValueType | string;
};

export const ValueFormItem = ({ valueType }: ValueFormItemProps) => {
  switch (valueType) {
    case 'number':
      return (
        <Form.Item
          label="Value"
          name="value"
        >
          <InputNumber />
        </Form.Item>
      );
    case 'boolean':
      return (
        <Form.Item
          label="Value"
          name="value"
        >
          <Switch
            checkedChildren="true"
            unCheckedChildren="false"
            defaultChecked
          />
        </Form.Item>
      );
    case 'nullish':
      return (
        <Form.Item
          label="Value"
          name="value"
        >
          <Switch
            checkedChildren="null"
            unCheckedChildren="undefined"
            defaultChecked
          />
        </Form.Item>
      );
    default:
      return (
        <Form.Item
          label="Value"
          name="value"
        >
          <Input />
        </Form.Item>
      );
  }
};

type FormValues = {
  key: string;
  value: string | number | boolean;
  valueType: ValueType;
};

type ForceStateFormProps = {
  /**
   * The loading state
   */
  isLoading?: boolean;
  /**
   * The game state
   */
  state: GameState;
  /**
   * The admin action being performed
   */
  onPerformAdminAction: (params: { state: Partial<GameState>; action: string }) => Promise<void>;
};

export const ForceStateForm = ({ isLoading, state, onPerformAdminAction }: ForceStateFormProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [valueType, setValueType] = useState('string');
  const stateKeys = Object.keys(state).map((k) => ({ label: k, value: k }));

  const onValueTypeSelectChange = (newType: ValueType) => {
    if (['boolean', 'nullish'].includes(newType)) form.setFieldsValue({ value: true });
    if (newType === 'number') form.setFieldsValue({ value: 0 });
    if (newType === 'string') form.setFieldsValue({ value: '' });
    setValueType(newType);
  };

  const onFinish = async (values: FormValues) => {
    let parsedValue: string | number | boolean | null | undefined = values.value;

    try {
      if (values.valueType === 'number') {
        parsedValue = Number(values.value) ?? 0;
      }
      if (values.valueType === 'nullish') {
        parsedValue = values.value ? null : undefined;
      }

      const payload = {
        [values.key]: parsedValue,
      };

      if (window.confirm(`Tem certeza que quer forçar o estado ${JSON.stringify(payload)}`)) {
        await onPerformAdminAction({ state: payload, action: HOST_API_ACTIONS.FORCE_STATE_PROPERTY });

        form.resetFields();
        setValueType('string');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      message.error(`Something went wrong: ${errorMessage}`);
    }
  };

  return (
    <Form
      name="basic"
      form={form}
      initialValues={{ valueType: 'string' as unknown as ValueType }}
      onFinish={onFinish}
    >
      <h3>Force Property</h3>
      <Form.Item
        label="Key"
        name="key"
        rules={[{ required: true }]}
      >
        <AutoComplete options={stateKeys} />
      </Form.Item>
      <Form.Item
        label="Type"
        name="valueType"
      >
        <Select
          onChange={onValueTypeSelectChange}
          options={[
            { value: 'string', label: 'string' },
            { value: 'number', label: 'number' },
            { value: 'boolean', label: 'boolean' },
            { value: 'nullish', label: 'nullish' },
          ]}
        />
      </Form.Item>

      <ValueFormItem valueType={valueType} />

      <Button
        type="primary"
        htmlType="submit"
        disabled={isLoading}
        danger
      >
        Submit
      </Button>
    </Form>
  );
};

type PlayersReadyStateProps = {
  /**
   * The game players
   */
  players: GamePlayers;
};

type PlayerStatus = {
  readyPlayers: string[];
  pendingPlayers: string[];
};

export function PlayersReadyState({ players }: PlayersReadyStateProps) {
  const { readyPlayers, pendingPlayers }: PlayerStatus = Object.values(players).reduce(
    (acc: PlayerStatus, player) => {
      if (player.ready) {
        acc.readyPlayers.push(player.name);
      } else {
        acc.pendingPlayers.push(player.name);
      }

      return acc;
    },
    {
      readyPlayers: [],
      pendingPlayers: [],
    },
  );

  return (
    <li className={styles.adminPlayersReadyState}>
      <h3>Players Ready State</h3>
      <div className={styles.entry}>
        <CheckCircleFilled
          style={{ color: 'green' }}
          title="Ready:"
        />
        <ul className={styles.list}>
          {readyPlayers.map((playerName) => (
            <li
              key={`admin-player-${playerName}`}
              className={styles.item}
            >
              {playerName}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.entry}>
        <MinusCircleFilled
          style={{ color: 'orange' }}
          title="Ready:"
        />
        <ul className={styles.list}>
          {pendingPlayers.map((playerName) => (
            <li
              key={`admin-player-${playerName}`}
              className={styles.item}
            >
              {playerName}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
