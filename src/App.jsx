import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RepairProvider } from './context/RepairContext';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/common/ToastContainer';
import DemoRoleSwitcher from './components/common/DemoRoleSwitcher';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RepairProvider>
          <div className="min-h-screen bg-bg-light text-primary-text font-sans antialiased selection:bg-brand-accent selection:text-brand-primary">
            <AppRoutes />
            <ToastContainer />
            <DemoRoleSwitcher />
          </div>
        </RepairProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
