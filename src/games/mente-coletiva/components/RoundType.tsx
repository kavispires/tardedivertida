import clsx from 'clsx';
import { Icons } from 'components/icons';
import { Translate } from 'components/language';
// Components

type RoundTypeProps = {
  roundType: Number;
  className?: string;
};

export function RoundType({ roundType, className = '' }: RoundTypeProps) {
  const arrowBaseClass = 'm-round-type__arrow';
  return (
    <div className={clsx('m-round-type', className)}>
      <div className="m-round-type__arrows">
        {roundType === 0 && <Icons.Arrow className={clsx(arrowBaseClass, `${arrowBaseClass}--0`)} />}
        <Icons.Arrow className={clsx(arrowBaseClass, `${arrowBaseClass}--1`)} />
        {roundType >= 2 && <Icons.Arrow className={clsx(arrowBaseClass, `${arrowBaseClass}--2`)} />}
        {roundType === 3 && <Icons.Arrow className={clsx(arrowBaseClass, `${arrowBaseClass}--3`)} />}
      </div>

      <div>
        <Translate pt={<>Nesta rodada,</>} en={<>This round</>} />
      </div>
      {roundType === 1 && (
        <Translate
          pt={<>todos com a pontuação mais baixa movem uma cerquinha para direita.</>}
          en={<>all players with the lowest score move one fence to the right.</>}
        />
      )}
      {roundType === 2 && (
        <Translate
          pt={
            <>
              todos com as <span className="m-round-type__number">2</span> pontuações mais baixas movem uma
              cerquinha para direita.
            </>
          }
          en={
            <>
              all players with the <span className="m-round-type__number">2</span> lowest scores move one
              fence to the right.
            </>
          }
        />
      )}
      {roundType === 3 && (
        <Translate
          pt={
            <>
              todos com as <span className="m-round-type__number">3</span> pontuações mais baixas movem uma
              cerquinha para direita.
            </>
          }
          en={
            <>
              all players with the <span className="m-round-type__number">3</span> lowest scores move one
              fence to the right.
            </>
          }
        />
      )}
      {roundType === 0 && (
        <Translate
          pt={
            <>
              todos com a pontuação mais baixa movem uma cerquinha para direita e todos com a pontuação mais
              alta movem uma cerquinha <span className="m-round-type__highlight">para a esquerda</span>!
            </>
          }
          en={
            <>
              all players with the lowest score move one fence to the right and all players with the highest
              score move one fence <span className="m-round-type__highlight">to the left</span>!
            </>
          }
        />
      )}
    </div>
  );
}
