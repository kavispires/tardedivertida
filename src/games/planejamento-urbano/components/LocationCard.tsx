import clsx from 'clsx';
// Ant Design Resources
import {
  BankFilled,
  BulbFilled,
  CloudFilled,
  CustomerServiceFilled,
  ExperimentFilled,
  GiftFilled,
  HomeFilled,
  MedicineBoxFilled,
  QuestionCircleFilled,
  ReadFilled,
  ShopFilled,
  StarFilled,
  TruckFilled,
} from '@ant-design/icons';
import { Typography } from 'antd';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { DualTranslate } from 'components/language';
// Internal
import { CityLocationsDict } from '../utils/types';

type LocationCardProps = {
  locationId: string;
  cityLocationsDict: CityLocationsDict;
  width: number;
  className?: string;
  fontSize?: 'normal' | 'small';
};

export function LocationCard({
  locationId,
  cityLocationsDict,
  width,
  className,
  fontSize,
}: LocationCardProps) {
  const location = cityLocationsDict?.[locationId];
  return (
    <div
      className={clsx('city-site city-site--constructed', className)}
      style={{
        width,
        height: width,
        backgroundImage: `url('${PUBLIC_URL.IN_GAME}city-image.jpg')`,
      }}
    >
      <span>
        <div className="city-site-category">{getLocationCategoryIcon(location.category)}</div>
        <Typography.Text className={clsx('city-site-name', `city-site-name--${fontSize}`)}>
          <DualTranslate>{location.name}</DualTranslate>
        </Typography.Text>
      </span>
    </div>
  );
}

const getLocationCategoryIcon = (category: string) => {
  switch (category) {
    case 'Accommodation':
      return <GiftFilled />;
    case 'Government':
      return <BankFilled />;
    case 'Commercial':
      return <ShopFilled />;
    case 'Cultural':
      return <BulbFilled />;
    case 'Education':
      return <ReadFilled />;
    case 'Entertainment':
      return <CustomerServiceFilled />;
    case 'Industrial':
      return <ExperimentFilled />;
    case 'Infrastructure':
      return <MedicineBoxFilled />;
    case 'Natural':
      return <CloudFilled />;
    case 'Residential':
      return <HomeFilled />;
    case 'Transportation':
      return <TruckFilled />;
    case 'Special':
      return <StarFilled />;
    default:
      return <QuestionCircleFilled />;
  }
};
