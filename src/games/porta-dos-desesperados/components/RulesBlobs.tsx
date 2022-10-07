// Ant Design Resources
import { RadarChartOutlined } from '@ant-design/icons';
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
            abrimos usamos <CrystalHighlight negative>1</CrystalHighlight> cristal.
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
            through costs us <CrystalHighlight negative>1</CrystalHighlight> crystal.
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
            usamos <CrystalHighlight negative>1</CrystalHighlight> cristal.
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
            through costs us <CrystalHighlight negative>1</CrystalHighlight> crystal.
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
            Diz a lenda que a batata da perna estava muito saborosa. No final das contas todo mundo morreu...
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
