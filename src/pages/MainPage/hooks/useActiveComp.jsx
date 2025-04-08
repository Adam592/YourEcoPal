import { useState, useCallback } from 'react';
import DashboardPage from '../../../pages/DashboardPage/DashboardPage';
import QRScannerPage from '../../../pages/QRScannerPage/QRScannerPage';
import ActivityPage from '../../../pages/ActivityPage/ActivityPage';

export const useActiveComponent = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = useCallback(() => {
    switch (activeComponent) {
      case 'dashboard':
        return <DashboardPage />;
      case 'qrscanner':
        return <QRScannerPage />;
      case 'activity':
        return <ActivityPage />;
      default:
        return <DashboardPage />;
    }
  }, [activeComponent]);

  return { activeComponent, setActiveComponent, renderComponent };
};
