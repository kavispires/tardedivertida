/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// import { Image, Layout } from 'antd';
// Resources
import { Button, Space } from 'antd';

import { DevHeader } from './DevHeader';
import { useTitle } from 'react-use';
import { CSSProperties, useState } from 'react';
import { useQuery } from 'react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from 'services/firebase';

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
    </div>
  );
}

export default Playground;

function generateRandomPath(distance: number, entryPoint?: number): number[] {
  const gridWidth = 7;
  const gridHeight = 5;
  const entryPoints = [1, 3, 5, 7, 13, 21, 27, 29, 31, 33];
  const directions = [-gridWidth, 1, gridWidth, -1]; // Up, Right, Down, Left

  const path: number[] = [];

  const getRandomDirection = (cell: number): number => {
    const possibleDirections = [];
    for (const direction of directions) {
      const neighborCell = cell + direction;
      if (neighborCell >= 0 && neighborCell < gridWidth * gridHeight && !path.includes(neighborCell)) {
        possibleDirections.push(direction);
      }
    }
    if (possibleDirections.length === 0) return 0;
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  };

  let currentCell = entryPoint ?? entryPoints[Math.floor(Math.random() * entryPoints.length)];
  path.push(currentCell);

  while (path.length < distance) {
    const direction = getRandomDirection(currentCell);
    if (direction === null) break;
    currentCell += direction;
    path.push(currentCell);
  }

  return path;
}

// Usage:
console.log(2, generateRandomPath(2));
console.log(2, generateRandomPath(2));
console.log(3, generateRandomPath(3));
console.log(3, generateRandomPath(3));
console.log(4, generateRandomPath(4));
console.log(4, generateRandomPath(4));
console.log(5, generateRandomPath(5));
console.log(5, generateRandomPath(5));
console.log(10, generateRandomPath(10));
console.log(10, generateRandomPath(10));
