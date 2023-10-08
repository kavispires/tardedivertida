// Ant Design Resources
import { RadarChartOutlined, RobotOutlined } from '@ant-design/icons';
// Utils
import { getTrapDetails } from '../utils/helpers';
import { TOTAL_DOORS } from '../utils/constants';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { FixedMenuButton } from 'components/buttons';
import { CrystalHighlight, DoorHighlight } from './Highlights';
import { sortPlayers } from 'utils/helpers';
import { AvatarName } from 'components/avatars';

type RoundOneRuleProps = {
  magic: number;
};

export function RoundOneRule({ magic }: RoundOneRuleProps) {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Somos estudantes de feitiçaria presos num corredor de portas tentando voltar pra casa.
            <br />
            Devemos que passar por <DoorHighlight>{TOTAL_DOORS}</DoorHighlight> portas.
            <br />
            Mas temos apenas <CrystalHighlight>{magic}</CrystalHighlight> cristais mágicos e cada porta que
            abrimos usamos <CrystalHighlight type="negative">1</CrystalHighlight> cristal.
            <br />
            Será que conseguimos sair antes que nossa mágica acabe?
          </>
        }
        en={
          <>
            We are witchcraft students trapped in a corridor of doors trying to get back home.
            <br />
            We must go through <DoorHighlight>{TOTAL_DOORS}</DoorHighlight>
            doors.
            <br />
            But we only have <CrystalHighlight>{magic}</CrystalHighlight> magic crystals and each door we go
            through costs us <CrystalHighlight type="negative">1</CrystalHighlight> crystal.
            <br />
            Can we get out before our crystals are gone?
          </>
        }
      />
    </Instruction>
  );
}

type RoundRuleProps = {
  magic: number;
  currentCorridor: number;
};

export function RoundRule({ magic, currentCorridor }: RoundRuleProps) {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Porta
            <DoorHighlight>
              {currentCorridor} / {TOTAL_DOORS}
            </DoorHighlight>
            <br />
            Ainda temos <CrystalHighlight>{magic}</CrystalHighlight> cristais mágicos e cada porta que abrimos
            usamos <CrystalHighlight type="negative">1</CrystalHighlight> cristal.
            <br />
            Será que conseguimos sair antes que nossa mágica acabe?
          </>
        }
        en={
          <>
            Door
            <DoorHighlight>
              {currentCorridor} / {TOTAL_DOORS}
            </DoorHighlight>
            <br />
            We still have <CrystalHighlight>{magic}</CrystalHighlight> magic crystals left and each door we go
            through costs us <CrystalHighlight type="negative">1</CrystalHighlight> crystal.
            <br />
            Can we get out before our crystals are gone?
          </>
        }
      />
    </Instruction>
  );
}

type TrapRuleProps = {
  trap: string;
  showTitle?: boolean;
};

export function TrapRule({ trap, showTitle = false }: TrapRuleProps) {
  const { title, description, TrapIcon } = getTrapDetails(trap);
  return (
    <Instruction contained>
      <TrapIcon style={{ width: '3rem' }} />
      {showTitle && (
        <Title size="xx-small" level={3}>
          <Translate pt={title.pt} en={title.en} />
        </Title>
      )}
      <Translate pt={description.pt} en={description.en} />
    </Instruction>
  );
}

export function TrapPopupRule({ trap }: Pick<TrapRuleProps, 'trap'>) {
  return (
    <FixedMenuButton
      type="popover"
      content={<TrapRule trap={trap} showTitle />}
      position={1}
      icon={<RadarChartOutlined />}
    />
  );
}

export function LoseGameText({ players }: { players: GamePlayers }) {
  const sortedPlayers = sortPlayers(players);

  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            A comida acabou após alguns dias e fomos obrigados a dar uma chance ao canibalismo.{' '}
            <AvatarName player={sortedPlayers[1]} /> foi o primeiro a partir e servir de alimento aos outros.
            Diz a lenda que a batata da perna estava muito saborosa. No final das contas, todo mundo morreu...
          </>
        }
        en={
          <>
            The food soon was gone, we had to give in and try cannibalism.{' '}
            <AvatarName player={sortedPlayers[1]} /> was the first to go and served as food to others. The
            legend says its calf was very tasty and bough the rest of the group some extra days of live. In
            the end, we all died...
          </>
        }
      />
    </Instruction>
  );
}

export function BotsRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Em um jogo com bots, 2 jogadores-robôs são adicionados ao jogo.
            <br />
            Quando a escolha das portas acontece, eles selecionam cada um uma porta aleatória, mas há 20-40%
            de chance um deles selecionar a página correta.
            <br />
            Em comparação, você tem 14-16% de chance de escolher a porta correta, dependendo da armadilha.
          </>
        }
        en={
          <>
            In a game with bos, the 2 bots are added to the game.
            <br />
            Each bot will randomly select a door, but there are 20-40% chance they will select the correct
            door.
            <br />
            In comparison, you have 14-16% chances of choosing the correct door, depending on the trap.
          </>
        }
      />
    </Instruction>
  );
}

export function BotPopupRule() {
  return (
    <FixedMenuButton
      type="popover"
      position={2}
      icon={<RobotOutlined />}
      content={<BotsRules />}
      label={<Translate pt=" Bots" en=" Bots" />}
      buttonProps={{
        type: 'primary',
      }}
    />
  );
}
