// Ant Design Resources
import { Flex, Popover, Tooltip, Typography } from 'antd';
// Icons
import { BombIcon } from 'icons/BombIcon';
import { BoxBlankIcon } from 'icons/collection';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { CollapsibleRule } from 'components/rules';

export function Tips() {
  return (
    <CollapsibleRule
      title={
        <Translate
          pt="Dicas"
          en="Tips"
        />
      }
      style={{ minWidth: '320px', textAlign: 'left' }}
    >
      <Translate
        pt={
          <>
            <strong>
              Essas são algumas dicas sobre como tomar decisões no jogo, mas não são regras, faça o que
              quiser:
            </strong>
            <br />
            Nunca declare que você tem a bomba! Se você é um agente e um outro jogador estiver prestes a
            examinar uma de suas cartas, aí sim, você pode declarar verbalmente que tem a bomba.
            <br />
            Agentes sempre devem ser verdadeiros (a não ser que você tenha a carta da Bomba).
            <br />
            Se você quiser ser o alvo de investigação, declare que tem mais fios vermelhos do que realmente
            tem. (isso tanto para agentes quanto para terroristas).
          </>
        }
        en={
          <>
            <strong>
              These are some tips on how to make decisions in the game, but they are not rules, do as you
              wish:
            </strong>
            <br />
            Never declare that you have the bomb! If you are an agent and another player is about to examine
            one of your cards, only then you may verbally declare that you have the bomb.
            <br />
            Agents must always tell the truth (unless you have the bomb card).
            <br />
            If you want to be the target of investigation, declare that you have more red wires than you
            actually have. (this applies to both agents and terrorists).
          </>
        }
      />
    </CollapsibleRule>
  );
}
