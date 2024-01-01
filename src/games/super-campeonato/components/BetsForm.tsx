import clsx from 'clsx';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { Bracket, FightingContender } from '../utils/type';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getSmartBetContenderOptions } from '../utils/helpers';
import { DEFAULT_BETS, TIER_BY_STEP } from '../utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Icons
import { MedalIcon } from 'icons/MedalIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { ThumbsUpIcon } from 'icons/ThumbsUpIcon';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { ContendersSelect } from './ContendersSelect';
import { IconAvatar } from 'components/avatars';
import { ResetBetsButton } from './ResetBetsButton';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type BetsFormProps = {
  brackets: Bracket[];
  onSubmitBets: GenericFunction;
};

export function BetsForm({ brackets, onSubmitBets }: BetsFormProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [contenders, setContenders] = useState<FightingContender[]>([]);

  const [bets, setBets] = useState(DEFAULT_BETS);

  const resetBets = () => {
    setStep(0);
    setBets(DEFAULT_BETS);
  };

  const updateBet = (value: StringDictionary) => {
    setBets((s) => ({ ...s, ...value }));
  };

  useEffect(() => {
    setContenders(getSmartBetContenderOptions(brackets, TIER_BY_STEP[step], bets, language));
  }, [brackets, step, bets, language]);

  const availableContenders = contenders.filter((contender) => !Object.values(bets).includes(contender.id));

  return (
    <div className="w-bet-form">
      {step === 0 && (
        <Instruction
          contained
          className={clsx(
            'w-bet-form__container',
            'w-bet-form__container--final',
            getAnimationClass('zoomIn')
          )}
        >
          <IconAvatar icon={<TrophyIcon />} size="large" />
          <p className="w-bet-form__instruction">
            <Translate
              pt={
                <>
                  Selecione o competidor que você acha que <u>vai ganhar a final</u>.
                  <br />
                  Se ele ganhar, você recebe <PointsHighlight>5</PointsHighlight> pontos.
                </>
              }
              en={
                <>
                  Select the contender you think will <u>win the final</u>.
                  <br />
                  If they win, you gain <PointsHighlight>5</PointsHighlight> points.
                </>
              }
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            language={language}
            betTier={TIER_BY_STEP[step]}
          />

          <Space className="space-container">
            <ResetBetsButton onConfirm={resetBets} />
            <Button onClick={() => setStep(step + 1)} disabled={Boolean(!bets.final)} type="primary">
              <Translate pt="Próximo" en="Next" />
            </Button>
          </Space>
        </Instruction>
      )}
      {step === 1 && (
        <Instruction
          contained
          className={clsx(
            'w-bet-form__container',
            'w-bet-form__container--semi',
            getAnimationClass('zoomIn')
          )}
        >
          <IconAvatar icon={<MedalIcon />} size="large" />
          <p className="w-bet-form__instruction">
            <Translate
              pt={
                <>
                  Selecione o competidor que você acha que ganha uma <u>semifinal</u>.
                  <br />
                  Se ele ganhar, você recebe <PointsHighlight>3</PointsHighlight> pontos.
                </>
              }
              en={
                <>
                  Select the contender you think will win at least a <u>semifinal</u>.
                  <br />
                  If they win, you gain <PointsHighlight>3</PointsHighlight> points.
                </>
              }
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            language={language}
            betTier={TIER_BY_STEP[step]}
          />

          <Space className="space-container">
            <ResetBetsButton onConfirm={resetBets} />
            <Button onClick={() => setStep(step + 1)} disabled={Boolean(!bets.semi)} type="primary">
              <Translate pt="Próximo" en="Next" />
            </Button>
          </Space>
        </Instruction>
      )}
      {step === 2 && (
        <Instruction
          contained
          className={clsx(
            'w-bet-form__container',
            'w-bet-form__container--quarter',
            getAnimationClass('zoomIn')
          )}
        >
          <IconAvatar icon={<ThumbsUpIcon />} size="large" />
          <p className="w-bet-form__instruction">
            <Translate
              pt={
                <>
                  Selecione o competidor que você acha que ganha uma <u>quarta de final</u>.
                  <br />
                  Se ele ganhar, você recebe <PointsHighlight>1</PointsHighlight> pontos.
                </>
              }
              en={
                <>
                  Select the contender you think will win at least a <u>quarterfinal</u>.
                  <br />
                  If they win, you gain <PointsHighlight>1</PointsHighlight> points.
                </>
              }
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            language={language}
            betTier={TIER_BY_STEP[step]}
          />

          <Space className="space-container">
            <ResetBetsButton onConfirm={resetBets} />
            <Button onClick={() => onSubmitBets(bets)} type="primary" disabled={Boolean(!bets.quarter)}>
              <Translate pt="Enviar Apostas" en="Submit Bets" />
            </Button>
          </Space>
        </Instruction>
      )}
    </div>
  );
}
