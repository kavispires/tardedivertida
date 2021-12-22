import React, { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
// Design Resources
import { Card, Layout, Progress, Space } from 'antd';
// Utils
import { PUBLIC_URL } from '../utils/constants';
// Components
import { LoadingPage } from '../components/loaders';
import { CanvasSVG } from '../components/canvas';
import { Title } from '../components/shared';

function Gallery() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  const getData = () => {
    setIsLoading(true);
    fetch(`${PUBLIC_URL.RESOURCES}/arteRuimGallery.json`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const sortedDataSource = orderBy(
      Object.values(data).reduce((acc, entry) => {
        const data = {
          id: entry.id,
          text: entry.text,
          level: entry.level,
        };

        entry.entries.forEach((drawingEntry) => {
          const date = new Date(drawingEntry.createdAt).toLocaleString();
          acc.push({
            ...data,
            drawing: drawingEntry.drawing,
            playerId: drawingEntry.playerId,
            successRate: drawingEntry.successRate,
            createdAt: drawingEntry.createdAt,
            date,
          });
        });
        return acc;
      }, []),
      ['text', 'playerId'],
      ['asc', 'asc']
    );
    setDataSource(sortedDataSource);
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="container">
      <Title>Galeria</Title>

      <Space wrap className="gallery">
        {dataSource.map((entry) => {
          return (
            <Card
              cover={<CanvasSVG drawing={entry.drawing} className="gallery__card-drawing" />}
              className="gallery__card"
            >
              <div className="gallery__card-content">
                <h3 className="gallery__card-title">{entry.text}</h3>
                <p className="gallery__card-credits">by {entry.playerId}</p>
                <p className="gallery__card-date">{entry.date.split(', ')[0]}</p>
                <p className="gallery__card-level">{Array(entry.level).fill('☆').join('')}</p>
                <Progress
                  type="circle"
                  percent={entry.successRate ? entry.successRate * 100 : 0}
                  width={30}
                  status={entry.successRate < 0.1 ? 'exception' : undefined}
                  className="gallery__card-progress"
                />
              </div>
            </Card>
          );
        })}
      </Space>
    </Layout.Content>
  );
}

export default Gallery;
