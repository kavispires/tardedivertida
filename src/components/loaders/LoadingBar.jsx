import React from 'react';
// Hooks
import { useLoading } from '../../hooks';

export function LoadingBar() {
  const [isLoading] = useLoading();

  return isLoading ? <div className="loading-bar"></div> : <></>;
}
