// Ant Design Resources
import { Flex } from 'antd';
// Components
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import { ROLE_IMAGES_NAMES } from '../utils/constants';
import type { DataCounts } from '../utils/types';
import { AgentHighlight, BombHighlight, RedWireHighlight, TerroristHighlight } from './Highlights';

type RoleCard = {
  role: string;
  dataCounts: DataCounts;
};

export function RoleCard({ role = 'agent', dataCounts }: RoleCard) {
  const minAgents = dataCounts.wires - dataCounts.terrorists;

  return (
    <Flex
      className="contained"
      align="center"
    >
      <ImageCard
        cardWidth={150}
        cardId={ROLE_IMAGES_NAMES[role]}
        type="square"
      />
      <RuleInstruction
        type="lore"
        style={{ maxWidth: '320px', minWidth: 'auto' }}
      >
        {role === 'terrorist' ? (
          <Translate
            en="You are a <terrorist>terrorist</terrorist>!<br/>Your goal is to find the <bomb>bomb</bomb> OR prevent the agents from cutting the  <redWires>{red wires}</redWires> by the end of the final round.<br/>There are {minAgentsCount} or {maxAgentCount} agents in the game, the rest are terrorists."
            pt="Você é um <terrorist>terrorista</terrorist>!<br/>Seu objetivo é encontrar a <bomb>bomba</bomb> OU prevenir que os agentes cortem os <redWires>fios vermelhos</redWires> até o final da última rodada.<br/>Há {minAgentsCount} ou {maxAgentCount} agentes no jogo, o resto é terrorista."
            values={{
              terrorist: (text: string) => <TerroristHighlight>{text}</TerroristHighlight>,
              bomb: (text: string) => <BombHighlight>{text}</BombHighlight>,
              redWires: (text: string) => (
                <RedWireHighlight>
                  {dataCounts.wires} {text}
                </RedWireHighlight>
              ),
              minAgentsCount: <TextHighlight>{minAgents}</TextHighlight>,
              maxAgentCount: <TextHighlight>{dataCounts.agents}</TextHighlight>,
            }}
          />
        ) : (
          <Translate
            en="You are an <agent>agent</agent>!<br/>Your goal is to cut all the <redWires>red wires</redWires> and never the <bomb>bomb</bomb>!<br/>There are {minAgentsCount} or {maxAgentCount} agents in the game, the rest are terrorists."
            pt="Você é um <agent>agente</agent>!<br/>Seu objetivo é cortar todos os <redWires>fios vermelhos</redWires> e nunca a <bomb>bomba</bomb>!<br/>Há {minAgentsCount} ou {maxAgentCount} agentes no jogo, o resto é terrorista."
            values={{
              agent: (text: string) => <AgentHighlight>{text}</AgentHighlight>,
              redWires: (text: string) => (
                <RedWireHighlight>
                  {dataCounts.wires} {text}
                </RedWireHighlight>
              ),
              bomb: (text: string) => <BombHighlight>{text}</BombHighlight>,
              minAgentsCount: <TextHighlight>{minAgents}</TextHighlight>,
              maxAgentCount: <TextHighlight>{dataCounts.agents}</TextHighlight>,
            }}
          />
        )}
      </RuleInstruction>
    </Flex>
  );
}
