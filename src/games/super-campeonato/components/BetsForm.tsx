import clsx from 'clsx';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { MedalIcon } from '@icons/MedalIcon';
import { ThumbsUpIcon } from '@icons/ThumbsUpIcon';
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
// Internal
import type { Bracket, FightingContender, SubmitBetsPayload } from '../utils/type';
import { getSmartBetContenderOptions } from '../utils/helpers';
import { DEFAULT_BETS, TIER_BY_STEP } from '../utils/constants';
import { ContendersSelect } from './ContendersSelect';
import { ResetBetsButton } from './ResetBetsButton';

type BetsFormProps = {
  brackets: Bracket[];
  onSubmitBets: (payload: SubmitBetsPayload) => void;
  userContenders: UID[];
};

export function BetsForm({ brackets, onSubmitBets, userContenders }: BetsFormProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [contenders, setContenders] = useState<FightingContender[]>([]);

  const [bets, setBets] = useState(DEFAULT_BETS);

  const resetBets = () => {
    setStep(0);
    setBets(DEFAULT_BETS);
  };

  const updateBet = (value: Dictionary<string>) => {
    setBets((s) => ({ ...s, ...value }));
  };

  useEffect(() => {
    setContenders(getSmartBetContenderOptions(brackets, TIER_BY_STEP[step], bets, language));
  }, [brackets, step, bets, language]);

  const availableContenders = contenders.filter((contender) => !Object.values(bets).includes(contender.id));

  return (
    <div className="w-bet-form">
      {step === 0 && (
        <Surface
          contained
          className={clsx(
            'w-bet-form__container',
            'w-bet-form__container--final',
            getAnimationClass('zoomIn'),
          )}
        >
          <Icon
            icon={<TrophyIcon />}
            size="large"
          />
          <p className="w-bet-form__instruction">
            <Translate
              pt="Selecione o competidor que você acha que <u>vai ganhar a final</u>.
                  <br />
                  Se ele ganhar, você recebe {points}."
              en="Select the contender you think will <u>win the final</u>.
                  <br />
                  If they win, you gain {points}>."
              values={{ points: <PointsHighlight value={5} /> }}
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            betTier={TIER_BY_STEP[step]}
            userContenders={userContenders}
          />

          <SpaceContainer>
            <ResetBetsButton onConfirm={resetBets} />
            <Button
              onClick={() => setStep(step + 1)}
              disabled={Boolean(!bets.final)}
              type="primary"
            >
              <Translate
                pt="Próximo"
                en="Next"
              />
            </Button>
          </SpaceContainer>
        </Surface>
      )}
      {step === 1 && (
        <Surface
          contained
          className={clsx(
            'w-bet-form__container',
            'w-bet-form__container--semi',
            getAnimationClass('zoomIn'),
          )}
        >
          <Icon
            icon={<MedalIcon />}
            size="large"
          />
          <p className="w-bet-form__instruction">
            <Translate
              pt="Selecione o competidor que você acha que ganha uma <u>semifinal</u>.
                  <br />
                  Se ele ganhar, você recebe {points}."
              en="Select the contender you think will win at least a <u>semifinal</u>.
                  <br />
                  If they win, you gain {points}."
              values={{ points: <PointsHighlight value={3} /> }}
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            betTier={TIER_BY_STEP[step]}
            userContenders={userContenders}
          />

          <SpaceContainer>
            <ResetBetsButton onConfirm={resetBets} />
            <Button
              onClick={() => setStep(step + 1)}
              disabled={Boolean(!bets.semi)}
              type="primary"
            >
              <Translate
                pt="Próximo"
                en="Next"
              />
            </Button>
          </SpaceContainer>
        </Surface>
      )}
      {step === 2 && (
        <Surface
          contained
          className={clsx(
            'w-bet-form__container',
            'w-bet-form__container--quarter',
            getAnimationClass('zoomIn'),
          )}
        >
          <Icon
            icon={<ThumbsUpIcon />}
            size="large"
          />
          <p className="w-bet-form__instruction">
            <Translate
              pt="Selecione o competidor que você acha que ganha uma <u>quarta de final</u>.
                  <br />
                  Se ele ganhar, você recebe {points}."
              en="Select the contender you think will win at least a <u>quarterfinal</u>.
                  <br />
                  If they win, you gain {points}."
              values={{ points: <PointsHighlight value={1} /> }}
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            betTier={TIER_BY_STEP[step]}
            userContenders={userContenders}
          />

          <SpaceContainer>
            <ResetBetsButton onConfirm={resetBets} />
            <SendButton
              onClick={() => onSubmitBets(bets)}
              disabled={Boolean(!bets.quarter)}
            >
              <Translate
                pt="Enviar Apostas"
                en="Submit Bets"
              />
            </SendButton>
          </SpaceContainer>
        </Surface>
      )}
    </div>
  );
}
