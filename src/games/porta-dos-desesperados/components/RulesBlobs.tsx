// Ant Design Resources
import { RadarChartOutlined, RobotOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { FixedMenuButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import { TOTAL_DOORS } from '../utils/constants';
import { getTrapIcon } from '../utils/helpers';
import type { TrapEntry } from '../utils/types';
import { CrystalHighlight, DoorHighlight } from './Highlights';
import { TrapLevel } from './TrapLevel';

type RoundOneRuleProps = {
  magic: number;
  difficulty: number;
};

export function RoundOneRule({ magic, difficulty }: RoundOneRuleProps) {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Somos estudantes presos num corredor de portas tentando voltar pra casa.
            <br />
            Devemos que passar por <DoorHighlight>{TOTAL_DOORS}</DoorHighlight> portas.
            <br />
            Mas o Livro só tem <CrystalHighlight>{magic}</CrystalHighlight> cristais mágicos de energia e cada
            porta que abrimos usamos <CrystalHighlight type="negative">-1</CrystalHighlight> cristal.
            <br />
            Será que conseguimos sair antes que nossa mágica acabe?
          </>
        }
        en={
          <>
            We are students trapped in a corridor of doors trying to get back home.
            <br />
            We must go through <DoorHighlight>{TOTAL_DOORS}</DoorHighlight>
            doors.
            <br />
            But the Book only has <CrystalHighlight>{magic}</CrystalHighlight> magic energy crystals and each
            door we go through costs us <CrystalHighlight type="negative">-1</CrystalHighlight> crystal.
            <br />
            Can we get out before our crystals are gone?
          </>
        }
      />

      <br />
      <strong>
        <Translate
          pt="Dificuldade: "
          en="Difficulty: "
        />
      </strong>
      <br />
      <TrapLevel
        level={difficulty}
        count={5}
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
  trapEntry: TrapEntry | null;
  showTitle?: boolean;
};

export function TrapRule({ trapEntry, showTitle = false }: TrapRuleProps) {
  if (!trapEntry) return null;

  const TrapIcon = getTrapIcon(trapEntry?.icon);

  return (
    <Instruction
      contained
      style={{ maxWidth: 512 }}
    >
      <TrapIcon style={{ width: '3rem' }} />
      {showTitle && (
        <Title
          size="xx-small"
          level={3}
        >
          <DualTranslate>{trapEntry.title}</DualTranslate>
        </Title>
      )}
      <DualTranslate>{trapEntry.description}</DualTranslate>
      <br />
      <div className="mt-4">
        <Translate
          pt="Dificuldade: "
          en="Difficulty: "
        />
        <br />
        <TrapLevel
          level={trapEntry.level}
          count={3}
        />
      </div>
    </Instruction>
  );
}

export function TrapPopupRule({ trapEntry }: Pick<TrapRuleProps, 'trapEntry'>) {
  return (
    <FixedMenuButton
      type="popover"
      content={
        <TrapRule
          trapEntry={trapEntry}
          showTitle
        />
      }
      position={1}
      icon={<RadarChartOutlined />}
    />
  );
}

export function LoseGameText({ players }: { players: GamePlayers }) {
  const sortedPlayers = sortPlayers(players);

  return (
    <Translate
      pt={
        <>
          A comida acabou após alguns dias e fomos obrigados a dar uma chance ao canibalismo.{' '}
          <PlayerAvatarName player={sortedPlayers[1]} /> foi o primeiro a partir e servir de alimento aos
          outros. Diz a lenda que a batata da perna estava muito saborosa. No final das contas, todo mundo
          morreu...
        </>
      }
      en={
        <>
          The food soon was gone, we had to give in and try cannibalism.{' '}
          <PlayerAvatarName player={sortedPlayers[1]} /> was the first to go and served as food to others. The
          legend says its calf was very tasty and bough the rest of the group some extra days of live. In the
          end, we all died...
        </>
      }
    />
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
      label={
        <Translate
          pt=" Bots"
          en=" Bots"
        />
      }
    />
  );
}
