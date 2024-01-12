import { useMemo, useState } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { Item, SubmitPairsPayload } from './utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockPairs } from './utils/mock';
// Components
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ItemEntry } from './components/ItemEntry';
import { TransparentButton } from 'components/buttons';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { getAnimationClass } from 'utils/helpers';

type StepTemplateProps = {
  players: GamePlayers;
  user: GamePlayer;
  pool: Item[];
  onSubmitPairs: (payload: SubmitPairsPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepMakePairs({ players, user, announcement, pool, onSubmitPairs }: StepTemplateProps) {
  const { isLoading } = useLoading();
  const [pairs, setPairs] = useState<(string | null)[]>([]);
  const pairsCount = Math.floor(pool.length / 2);
  const selectedPairs = useMemo(() => {
    return pairs.map((entry) => pool.find((item) => item.id === entry));
  }, [pairs, pool]);

  const isComplete = pairs.length === pairsCount * 2 && pairs.every(Boolean);

  useMock(() => {
    onSubmitPairs({ pairs: mockPairs(pool) });
  });

  const addItem = (key: string) => {
    if (isComplete) return;

    setPairs((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((element) => typeof element !== 'string');
      if (index !== -1) {
        // If a non-string element is found, add the key at that index
        copy[index] = key;
      } else {
        // If all elements are strings, add the key to the end of the array
        copy.push(key);
      }

      return copy;
    });
  };

  const removeItem = (key: string) => {
    setPairs((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((element) => element === key);
      if (index !== -1) {
        // If a non-string element is found, add the key at that index
        copy[index] = null;
      }

      return copy;
    });
  };

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={<>Agrupe os itens em {pairsCount} pares</>}
          en={<>Group the items into {pairsCount} pairs</>}
        />
      </Title>

      {isLoading}
      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Você ganha <PointsHighlight>pontos</PointsHighlight> por cada jogador que fez o mesmo par que
              você!
              <br />
              <strong>Clique</strong> em um item para adicioná-lo ao par.
              <br />
              Para remover, basta clicar no item novamente.
            </>
          }
          en={
            <>
              You get <PointsHighlight>points</PointsHighlight> for each player who did the same pair than
              you!
              <br />
              <strong>Click</strong> on an item to add it to the pair.
              <br />
              To remove, just click on the item again.
            </>
          }
        />
      </RuleInstruction>

      {pool.length % 2 === 1 && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                Um item ficará sobrando, você também ganha pontos por cada jogador que também deixou esse item
                sobrando!
              </>
            }
            en={
              <>One item will be left out, you also get points for each player who also left this item out!</>
            }
          />
        </RuleInstruction>
      )}

      <Space className={clsx('pairs-grid', `pairs-grid--${pairsCount}`)} wrap>
        {Array.from({ length: pairsCount }).map((_, index) => {
          const firstItemIndex = index * 2;
          const firstItem = pairs[firstItemIndex];
          const secondItem = pairs[firstItemIndex + 1];

          return (
            <Space
              className={clsx('pairs-grid__pair', `pairs-grid__pair--${index}`)}
              direction="vertical"
              key={`pair-${index}`}
            >
              <div className="pairs-grid__slot">
                {Boolean(firstItem) ? (
                  <TransparentButton
                    onClick={() => removeItem(firstItem!)}
                    className={getAnimationClass('bounceIn')}
                  >
                    <ItemEntry itemEntry={selectedPairs[firstItemIndex]!} />
                  </TransparentButton>
                ) : (
                  <ItemEntry itemEntry={pool[0]} className="pairs-grid__empty-slot" />
                )}
              </div>
              <div className="pairs-grid__slot">
                {Boolean(secondItem) ? (
                  <TransparentButton
                    onClick={() => removeItem(secondItem!)}
                    className={getAnimationClass('bounceIn')}
                  >
                    <ItemEntry itemEntry={selectedPairs[firstItemIndex + 1]!} />
                  </TransparentButton>
                ) : (
                  <ItemEntry itemEntry={pool[0]} className="pairs-grid__empty-slot" />
                )}
              </div>
            </Space>
          );
        })}
      </Space>

      <Space wrap className={clsx('options-grid', `options-grid--${pool.length}`)}>
        {pool.map((entry) => {
          const selected = pairs.includes(entry.id);
          if (selected) {
            return <ItemEntry itemEntry={entry} key={entry.id} className="options-grid--selected" />;
          }
          return (
            <TransparentButton onClick={() => addItem(entry.id)} key={entry.id}>
              <ItemEntry itemEntry={entry} looseItem />
            </TransparentButton>
          );
        })}
      </Space>

      <Space className="space-container">
        <Button
          size="large"
          type="primary"
          disabled={user.ready || !isComplete}
          loading={isLoading}
          onClick={() => onSubmitPairs({ pairs: pairs.map((v) => String(v)) })}
        >
          <Translate pt="Enviar Pares" en="Submit Pairs" />
        </Button>
      </Space>
    </Step>
  );
}
