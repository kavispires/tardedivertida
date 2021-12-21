import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Affix, Button, Popover, Spin } from 'antd';
import { FireFilled } from '@ant-design/icons';
// Hooks and API
import { GAME_API } from '../../adapters';
import { useAPICall, useGlobalState, useLoading } from '../../hooks';
// Components
import { ForceNextPhaseButton } from './ForceNextPhaseButton';
import { ForceStateForm } from './ForceStateForm';

export const AdminMenu = ({ state }) => {
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');
  const [visible, setVisible] = useState(false);

  const onGoToNextPhase = useAPICall({
    apiFunction: GAME_API.goToNextPhase,
    actionName: 'force-next-phase',
    successMessage: 'Funcionou, próxima fase!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
    onAfterCall: () => setVisible(false),
  });

  const onForceStateProperty = useAPICall({
    apiFunction: GAME_API.forceStateProperty,
    actionName: 'force-state-property',
    successMessage: 'Estato forçado com sucesso!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar forçar uma propriedade do estado',
    onAfterCall: () => setVisible(false),
  });

  if (!isAdmin) return <span></span>;

  const handleVisibility = (isVisible) => setVisible(isVisible);
  const showMenu = () => setVisible(true);

  return (
    <Fragment>
      <Affix offsetBottom={10} className="admin-menu__affix">
        <Popover
          placement="topLeft"
          title="Admin Actions"
          content={
            <ul>
              <li>
                <ForceNextPhaseButton isLoading={isLoading} onGoToNextPhase={onGoToNextPhase} />
              </li>
              <li>
                <hr />
              </li>
              <li>
                <ForceStateForm
                  isLoading={isLoading}
                  onForceStateProperty={onForceStateProperty}
                  state={state}
                />
              </li>
            </ul>
          }
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibility}
        >
          <Button
            type="primary"
            danger
            shape="circle"
            size="large"
            className="admin-menu__affix-button"
            onClick={showMenu}
            disabled={isLoading}
            icon={isLoading ? <Spin /> : <FireFilled />}
          />
        </Popover>
      </Affix>
    </Fragment>
  );
};

AdminMenu.propTypes = {
  state: PropTypes.object,
};
