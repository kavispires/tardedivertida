// Ant Design Resources
import { Flex } from 'antd';
// Components
import { ImageCard } from 'components/image-cards/ImageCard';
import { Translate } from 'components/language/Translate';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { TextHighlight } from 'components/text/TextHighlight';
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
            pt={
              <>
                Você é um <TerroristHighlight>terrorista</TerroristHighlight>!
                <br />
                Seu objetivo é encontrar a <BombHighlight>Bomba</BombHighlight> <strong>OU</strong> prevenir
                que os agentes cortem os{' '}
                <RedWireHighlight>{dataCounts.wires} fios vermelhos</RedWireHighlight> até o final da última
                rodada
                <br />
                Há{' '}
                <TextHighlight>
                  {minAgents} ou {dataCounts.agents} agentes
                </TextHighlight>{' '}
                no jogo, o resto é terrorista.
              </>
            }
            en={
              <>
                You are a <TerroristHighlight>terrorist</TerroristHighlight>!
                <br />
                Your goal is to find the <BombHighlight>Bomb</BombHighlight> <strong>OR</strong> prevent the
                agents from cutting the <RedWireHighlight>{dataCounts.wires} red wires</RedWireHighlight> by
                the end of the final round.
                <br />
                There are{' '}
                <TextHighlight>
                  {minAgents} or {dataCounts.agents} agents
                </TextHighlight>{' '}
                in the game, the rest are terrorists.
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
                <RedWireHighlight>{dataCounts.wires} fios vermelhos</RedWireHighlight> e nunca a{' '}
                <BombHighlight>Bomba</BombHighlight>!
                <br />
                Há{' '}
                <TextHighlight>
                  {minAgents} ou {dataCounts.agents} agentes
                </TextHighlight>{' '}
                no jogo, o resto é terrorista.
              </>
            }
            en={
              <>
                You are an <AgentHighlight>agent</AgentHighlight>!
                <br />
                Your goal is to cut all <RedWireHighlight>{dataCounts.wires} red wires</RedWireHighlight> and
                never the <BombHighlight>Bomb</BombHighlight>!
                <br />
                There are{' '}
                <TextHighlight>
                  {minAgents} or {dataCounts.agents} agents
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
