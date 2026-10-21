import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Overview } from './pages/Overview';
import { Incidents } from './pages/Incidents';
import { IncidentDetail } from './pages/IncidentDetail';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Agents } from './pages/Agents';
import { Insights } from './pages/Insights';
import { Control } from './pages/Control';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Overview />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="incidents/:id" element={<IncidentDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetail />} />
        <Route path="agents" element={<Agents />} />
        <Route path="insights" element={<Insights />} />
        <Route path="control" element={<Control />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
