// Ant Design Resources
import { Flex } from 'antd';
// Components
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { RuleInstruction, TextHighlight } from 'components/text';
// Internal
import { ROLE_IMAGES_NAMES } from '../utils/constants';
import type { DataCount } from '../utils/types';
import { AgentHighlight, BombHighlight, RedWireHighlight, TerroristHighlight } from './Highlights';

type RoleCard = {
  role: string;
  dataCount: DataCount;
};

export function RoleCard({ role = 'agent', dataCount }: RoleCard) {
  const minAgents = dataCount.wires - dataCount.terrorists;
  const minTerrorists = dataCount.wires - dataCount.agents;

  return (
    <Flex
      className="contained"
      align="center"
    >
      <ImageCard
        cardWidth={150}
        cardId={ROLE_IMAGES_NAMES[role]}
      />
      <RuleInstruction
        type="lore"
        style={{ maxWidth: '320px', minWidth: 'auto' }}
      >
        {role === 'terrorist' ? (
          <Translate
            pt={
              <>
                Você é um <TerroristHighlight>terrorista</TerroristHighlight>!
                <br />
                Seu objetivo é encontrar a <BombHighlight>Bomba</BombHighlight> <strong>OU</strong> prevenir
                que os agentes cortem os <RedWireHighlight>{dataCount.wires} fios vermelhos</RedWireHighlight>{' '}
                até o final da última rodada
                <br />
                Há{' '}
                <TextHighlight>
                  {minAgents} ou {dataCount.terrorists} terroristas
                </TextHighlight>{' '}
                no jogo.
              </>
            }
            en={
              <>
                You are a <TerroristHighlight>terrorist</TerroristHighlight>!
                <br />
                Your goal is to find the <BombHighlight>Bomb</BombHighlight> <strong>OR</strong> prevent the
                agents from cutting the <RedWireHighlight>{dataCount.wires} red wires</RedWireHighlight> by
                the end of the final round.
                <br />
                There are up to{' '}
                <TextHighlight>
                  {minTerrorists} ou {dataCount.terrorists} terrorists
                </TextHighlight>{' '}
                in the game.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                Você é um <AgentHighlight>agente</AgentHighlight>!
                <br />
                Seu objetivo é cortar todos os{' '}
                <RedWireHighlight>{dataCount.wires} fios vermelhos</RedWireHighlight> e nunca a{' '}
                <BombHighlight>Bomba</BombHighlight>!
                <br />
                Há{' '}
                <TextHighlight>
                  {minAgents} ou {dataCount.agents} agentes
                </TextHighlight>{' '}
                no jogo, o resto é terrorista.
              </>
            }
            en={
              <>
                You are an <AgentHighlight>agent</AgentHighlight>!
                <br />
                Your goal is to cut all <RedWireHighlight>{dataCount.wires} red wires</RedWireHighlight> and
                never the <BombHighlight>Bomb</BombHighlight>!
                <br />
                There are up to{' '}
                <TextHighlight>
                  {minAgents} ou {dataCount.agents} agents
                </TextHighlight>{' '}
                in the game, the rest are terrorists.
              </>
            }
          />
        )}
      </RuleInstruction>
    </Flex>
  );
}
