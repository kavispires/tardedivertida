import { useState } from 'react';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { ContendersSelect } from './ContendersSelect';

type BetsFormProps = {
  brackets: WBracket[];
  onSubmitBets: GenericFunction;
};

export function BetsForm({ brackets, onSubmitBets }: BetsFormProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  const [bets, setBets] = useState({ quarter: '', semi: '', final: '' });

  const updateBet = (value: StringDictionary) => {
    setBets((s) => ({ ...s, ...value }));
  };

  const contenders = orderBy(
    brackets.filter((entry) => entry.tier === 'quarter').map((entry) => ({ id: entry.id, name: entry.name })),
    `name.${language}`
  );

  const availableContenders = contenders.filter((contender) => !Object.values(bets).includes(contender.id));

  return (
    <div className="w-bet-form">
      {step === 0 && (
        <Instruction contained className="w-bet-form__container w-bet-form__container--final">
          <p className="w-bet-form__instruction">
            <Translate
              pt={
                <>
                  Selecione o competidor que você acha que <u>vai ganhar a final</u>.
                  <br />
                  Se ele ganhar, você recebe 5 pontos.
                </>
              }
              en={
                <>
                  Select the contender you think will <u>win the final</u>.
                  <br />
                  If they win, you gain 5 points.
                </>
              }
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            language={language}
            betTier="final"
          />

          <Space className="space-container">
            <Button onClick={() => setStep(step + 1)} disabled={Boolean(!bets.final)}>
              <Translate pt="Próximo" en="Next" />
            </Button>
          </Space>
        </Instruction>
      )}

      {step === 1 && (
        <Instruction contained className="w-bet-form__container w-bet-form__container--semi">
          <p className="w-bet-form__instruction">
            <Translate
              pt={
                <>
                  Selecione o competidor que você acha que ganha uma <u>semifinal</u>.
                  <br />
                  Se ele ganhar, você recebe 3 pontos.
                </>
              }
              en={
                <>
                  Select the contender you think will win at least a <u>semifinal</u>.
                  <br />
                  If they win, you gain 3 points.
                </>
              }
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            language={language}
            betTier="semi"
          />

          <Space className="space-container">
            <Button onClick={() => setStep(step + 1)} disabled={Boolean(!bets.semi)}>
              <Translate pt="Próximo" en="Next" />
            </Button>
          </Space>
        </Instruction>
      )}

      {step === 2 && (
        <Instruction contained className="w-bet-form__container w-bet-form__container--quarter">
          <p className="w-bet-form__instruction">
            <Translate
              pt={
                <>
                  Selecione o competidor que você acha que ganha uma <u>quarta de final</u>.
                  <br />
                  Se ele ganhar, você recebe 1 pontos.
                </>
              }
              en={
                <>
                  Select the contender you think will win at least a <u>quarterfinal</u>.
                  <br />
                  If they win, you gain 1 points.
                </>
              }
            />
          </p>

          <ContendersSelect
            contenders={availableContenders}
            updateBet={updateBet}
            language={language}
            betTier="quarter"
          />

          <Space className="space-container">
            <Button onClick={() => onSubmitBets(bets)} type="primary" disabled={Boolean(!bets.quarter)}>
              <Translate pt="Enviar Apostas" en="Submit Bets" />
            </Button>
          </Space>
        </Instruction>
      )}
    </div>
  );
}
