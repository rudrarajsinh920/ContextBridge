import React, { useState, useEffect, useCallback } from 'react';
import { PageView } from './types/navigation.js';
import { AppLayout } from './components/layout/AppLayout.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { DocumentsPage } from './pages/DocumentsPage.js';
import { fetchHealthStatus, HealthResponse } from './services/api.js';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const data = await fetchHealthStatus();
      setHealth(data);
    } catch (err) {
      setHealth(null);
      setHealthError(
        err instanceof Error ? err.message : 'Failed to reach API server'
      );
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardPage
            health={health}
            healthLoading={healthLoading}
            healthError={healthError}
          />
        );
      case 'projects':
        return <ProjectsPage />;
      case 'documents':
        return <DocumentsPage />;
      default:
        return (
          <DashboardPage
            health={health}
            healthLoading={healthLoading}
            healthError={healthError}
          />
        );
    }
  };

  return (
    <AppLayout
      currentView={currentView}
      onNavigate={setCurrentView}
      health={health}
      healthLoading={healthLoading}
      onRefreshHealth={checkHealth}
    >
      {renderCurrentView()}
    </AppLayout>
  );
};

export default App;
