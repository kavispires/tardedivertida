/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// import { Image, Layout } from 'antd';
// Resources
import { Button, Space } from 'antd';

import { DevHeader } from './DevHeader';
import { useTitle } from 'react-use';
import { CSSProperties, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from 'services/firebase';
import { DevSetsTable } from 'pages/Daily/games/AquiO/components/DevSetsTable';

function Playground() {
  useTitle('Playground | Dev | Tarde Divertida');

  const styles: CSSProperties = {
    // display: 'grid',
    // gridTemplateColumns: 'repeat(5, 1fr)',

    // gap: '1rem',
    display: 'flex',
    flexWrap: 'wrap',
  };
  const stylesLi: CSSProperties = {
    border: '1px solid black',
    margin: '4px',
    padding: '8px',
    // width: '132px',
    // display: 'flex',
    // flexDirection: 'column',
    background: 'white',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  };

  const [lines, setLines] = useState<any>([]);

  return (
    <div>
      <DevHeader title="Playground" />

      <Space>{}</Space>
      <DevSetsTable />
    </div>
  );
}

export default Playground;
