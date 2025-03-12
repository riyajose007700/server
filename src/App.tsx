import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { TerminalMonitoring } from './pages/TerminalMonitoring';
import { CommandCenter } from './pages/CommandCenter';
import { DeviceConfiguration } from './pages/DeviceConfiguration';
import { DashboardLayout } from './components/DashboardLayout';
import { ComingSoon } from './components/ComingSoon';
import { useAuthStore } from './store/authStore';
import TransactionDetails from './pages/TransactionDetails';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore(state => state.user);
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const ProtectedPage: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="pt-16">
          <ComingSoon pageName={pageName} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

function App() {
  const user = useAuthStore(state => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Terminal Monitoring */}
        <Route path="/terminal-monitoring" element={
          <ProtectedRoute>
            <TerminalMonitoring />
          </ProtectedRoute>
        } />

        {/* ATM Configuration Routes */}
        <Route path="/atm-config" element={
          <ProtectedRoute>
            <DeviceConfiguration />
          </ProtectedRoute>
        } />
        
        {/* Download Builder Routes */}
        <Route path="/download-builder/*">
          <Route index element={<ProtectedPage pageName="Download Builder" />} />
          <Route path="bin" element={<ProtectedPage pageName="BIN Configuration" />} />
          <Route path="fi-table" element={<ProtectedPage pageName="FI Table" />} />
          <Route path="options" element={<ProtectedPage pageName="Options" />} />
          <Route path="timer" element={<ProtectedPage pageName="Timer" />} />
          <Route path="states" element={<ProtectedPage pageName="States" />} />
          <Route path="screens" element={<ProtectedPage pageName="Screens" />} />
          <Route path="transaction-mapping" element={<ProtectedPage pageName="Transaction Mapping" />} />
          <Route path="response-mapping" element={<ProtectedPage pageName="Response Mapping" />} />
          <Route path="currencies" element={<ProtectedPage pageName="Currencies" />} />
        </Route>

        {/* Command Center */}
        <Route path="/command-center" element={
          <ProtectedRoute>
            <CommandCenter />
          </ProtectedRoute>
        } />

        {/* ICC Routes */}
        <Route path="/icc/*">
          <Route index element={<ProtectedPage pageName="ICC Management" />} />
          <Route path="application" element={<ProtectedPage pageName="ICC Application" />} />
          <Route path="transaction-data" element={<ProtectedPage pageName="ICC Transaction Data" />} />
          <Route path="secondary-application" element={<ProtectedPage pageName="ICC Secondary Application" />} />
          <Route path="language-data" element={<ProtectedPage pageName="ICC Language Data" />} />
        </Route>

        {/* Other Routes */}
        <Route path="/atm-group" element={<ProtectedPage pageName="ATM Group" />} />
        <Route path="/atm-receipt" element={<ProtectedPage pageName="ATM Receipt" />} />
        <Route path="/atm-type-config" element={<ProtectedPage pageName="ATM Type Configuration" />} />
        <Route path="/connections" element={<ProtectedPage pageName="Connections" />} />
        <Route path="/dispense-table" element={<ProtectedPage pageName="Dispense Table" />} />
        <Route path="/hsm-devices" element={<ProtectedPage pageName="HSM Devices" />} />
        <Route path="/keys" element={<ProtectedPage pageName="Keys" />} />
        <Route path="/ej" element={<ProtectedPage pageName="EJ" />} />
        <Route path="/database" element={<ProtectedPage pageName="Database" />} />
        <Route path="/connection-params" element={<ProtectedPage pageName="Connection Parameters" />} />
        <Route path="/hardware-config" element={<ProtectedPage pageName="Hardware Configuration" />} />
        <Route path="/hardware-config-desc" element={<ProtectedPage pageName="Hardware Configuration Description" />} />
        <Route path="/sensor-status" element={<ProtectedPage pageName="Sensor Status" />} />
        <Route path="/sensor-status-desc" element={<ProtectedPage pageName="Sensor Status Description" />} />
        <Route path="/supplies-status" element={<ProtectedPage pageName="Supplies Status" />} />
        <Route path="/supplies-status-desc" element={<ProtectedPage pageName="Supplies Status Description" />} />

         {/* Command Center */}
         <Route path="/transaction-details" element={
          <ProtectedRoute>
            <TransactionDetails />
          </ProtectedRoute>
        } />

        <Route path="/bna-counter" element={<ProtectedPage pageName="BNA Counter" />} />
        <Route path="/bna-note-def" element={<ProtectedPage pageName="BNA Note Definition" />} />
        <Route path="/currency-code" element={<ProtectedPage pageName="Currency Code" />} />
        <Route path="/media-config" element={<ProtectedPage pageName="Media Configuration" />} />
        <Route path="/pos-data-code" element={<ProtectedPage pageName="POS Data Code" />} />
        <Route path="/device-failure" element={<ProtectedPage pageName="Device Failure Category" />} />
        <Route path="/trace-viewer" element={<ProtectedPage pageName="Trace Viewer" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;