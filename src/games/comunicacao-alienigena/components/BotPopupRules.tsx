// Ant Design Resources
import { RobotOutlined } from '@ant-design/icons';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

export function BotsRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Entenda como o alienígena pensa:
            <ul>
              <li>
                Ele vai sempre tentar de falar um símbolo que você não sabe, então, se você perguntar algo
                similar a algo perguntando anteriormente, ele não repete e sim te dá o mais próximo
              </li>
              <li>Nos pedidos, os símbolos são ordenados do mais a ver para o menos a ver</li>
              <li>Defesa: proteção</li>
              <li>Bonito: colorido, festivo</li>
              <li>Sólido: duro, contrário de frágil ou macio</li>
              <li>Força: energia, poder</li>
              <li>Longo: comprido, alto</li>
              <li>Brilho: claro, luz</li>
              <li>Conhecimento: sabedoria, inteligência, tecnologia, ideologia, ideia</li>
              <li>Metal: se a ilustração tiver coisas metálicas, pode ser metal</li>
              <li>Máquina: tem engrenagens, energia, "funciona"</li>
            </ul>
          </>
        }
        en={
          <>
            Learn how the alien thinks:
            <ul>
              <li>
                They will always give you a symbol you don't know yet, so if you ask for something similar to
                a previous ask, they will give you the second best symbol.
              </li>
              <li>During requests, the symbols are order from more to less matching</li>
              <li>Defense: protection</li>
              <li>Beautiful: colorful, festive</li>
              <li>Solid: hard, very hard</li>
              <li>Power: force, energy</li>
              <li>Long: tall, lengthy</li>
              <li>Bright: light, shiny, (not smart)</li>
              <li>Knowledge: wisdom, smarts, technology, idea</li>
              <li>Metal: if the illustrator has anything metal, it may be metal</li>
              <li>Machine: it has gears, uses powers, "works"</li>
            </ul>
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
      position={1}
      icon={<RobotOutlined />}
      content={<BotsRules />}
      label={<Translate pt=" Bots" en=" Bots" />}
      buttonProps={{
        type: 'primary',
      }}
    />
  );
}
