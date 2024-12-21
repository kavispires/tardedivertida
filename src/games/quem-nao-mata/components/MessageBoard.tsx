// Ant Design Resources
import { Button, Form, Popover, Select } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PLACEHOLDER_PLAYER } from 'utils/constants';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
// Internal
import type { Message } from '../utils/types';

type MessageBoardProps = {
  messages: Record<PlayerId, Message>;
  onSubmitMessage: GenericFunction;
  disabled: boolean;
  players: GamePlayers;
  user: GamePlayer;
};

export function MessageBoard({ messages, onSubmitMessage, disabled, players }: MessageBoardProps) {
  return (
    <>
      <div className="q-message-board">
        <div className="">Anonymous: "Votem na fulana!"</div>
        <div className="">Anonymous: "Votem na fulana!"</div>
        <div className="">Anonymous: "Votem na fulana!"</div>
        <div className="">Anonymous: "Votem na fulana!"</div>
      </div>

      <div className="q-message-send">
        <Popover
          placement="top"
          title={<Translate pt="Enviar mensagem anônima" en="Send anonymous message" />}
          content={<PopOverMessageForm players={players} onSubmitMessage={onSubmitMessage} />}
          trigger="click"
        >
          <Button size="small" disabled={disabled}>
            Enviar mensagem
          </Button>
        </Popover>
      </div>
    </>
  );
}

type PopOverMessageFormProps = {
  onSubmitMessage: GenericFunction;
  players: GamePlayers;
};

function PopOverMessageForm({ onSubmitMessage, players }: PopOverMessageFormProps) {
  const { translate } = useLanguage();
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      initialValues={{
        recipientId: 'ALL',
      }}
      className="q-message-form"
      size="small"
      onFinish={(e) => console.log(e)}
    >
      <Form.Item label={<Translate pt="Apontem para" en="Aim on" />} name="targetId" required>
        <Select placeholder={<Translate pt="Selecione alguém" en="Select someone" />}>
          {Object.values(players).map((player) => {
            return (
              <Select.Option key={player.id} value={player.id}>
                <AvatarName player={player} />
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label={<Translate pt="Enviar para" en="Send to" />} name="recipientId" required>
        <Select placeholder={<Translate pt="Selecione alguém" en="Select someone" />}>
          <Select.Option value="ALL">
            <AvatarName
              player={{
                ...PLACEHOLDER_PLAYER,
                id: 'unknown',
                avatarId: 'N',
                name: translate('TODOS', 'EVERYBODY'),
              }}
            />
          </Select.Option>
          {Object.values(players).map((player) => {
            return (
              <Select.Option key={player.id} value={player.id}>
                <AvatarName player={player} />
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="">
        <Button type="primary" htmlType="submit">
          <Translate pt="Enviar" en="Send" />
        </Button>
      </Form.Item>
    </Form>
  );
}

// function Message({}) {
//   return (
//     <div>
//       <div>?</div>
//     </div>
//   );
// }
