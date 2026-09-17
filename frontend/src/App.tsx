import React, { useState } from 'react';
import { LoginView } from './views/LoginView';
import { CommandCenterView } from './views/CommandCenterView';
import { useAuthStore } from './store/useAuthStore';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {isLoggedIn ? (
        <CommandCenterView />
      ) : (
        <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;
