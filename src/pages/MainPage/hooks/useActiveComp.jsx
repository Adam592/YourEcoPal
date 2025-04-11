import { useState, useCallback } from 'react';
import DashboardPage from '../../../pages/DashboardPage/DashboardPage';
import QRScannerPage from '../../../pages/QRScannerPage/QRScannerPage';
import ActivityPage from '../../../pages/ActivityPage/ActivityPage';
import WaterPage from '../../WaterPage/WaterPage';
import ProfilePage from '../../../pages/ProfilePage/ProfilePage';

export const useActiveComponent = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = useCallback(() => {
    switch (activeComponent) {
      case 'dashboard':
        return <DashboardPage setActiveComponent={setActiveComponent} />;
      case 'qrscanner':
        return <QRScannerPage />;
      case 'activity':
        return <ActivityPage />;
      case 'water':
        return <WaterPage />;
      case 'profile':
        return <ProfilePage/>
      default:
        return <DashboardPage setActiveComponent={setActiveComponent}/>;
    }
  }, [activeComponent]);

  return { activeComponent, setActiveComponent, renderComponent };
};
