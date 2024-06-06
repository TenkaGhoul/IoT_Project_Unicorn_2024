import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './componements/dashboard/dashboard';
import Settings from './componements/settings/settings';
import NotFound from './componements/notFound/notFound';
import Simulation from './componements/simulation/simulation';

import './App.css';

function Main() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/simulation" element={<Simulation min={0} max={1000} step={1} onChange={() => {}} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

export default App;