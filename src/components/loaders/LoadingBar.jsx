import React from 'react';
// Hooks
import { useLoading } from '../../hooks';

function LoadingBar() {
  const [isLoading] = useLoading();

  return isLoading ? <div className="loading-bar"></div> : <></>;
}

export default LoadingBar;
